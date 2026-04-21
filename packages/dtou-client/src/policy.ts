import { Writer, DataFactory } from 'n3';
import type { AppPolicy } from './types.js';

const { namedNode, literal, blankNode } = DataFactory;

const NS     = 'http://example.org/ns#';
const VOCAB  = 'http://example.org/dtou-demo/vocab#';
const APP    = 'http://example.org/app#';

const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');

function n(iri: string) { return namedNode(iri); }

/**
 * Serialize an AppPolicy to Turtle.
 * The resulting Turtle is sent to the DToU server's /dtou endpoint.
 *
 * NOTE: The exact Turtle structure expected by the server should be verified
 * against https://github.com/renyuneyun/solid-dtou before finalizing.
 * The fixtures/app-policies/*.ttl files serve as the reference.
 */
export function serializeAppPolicy(policy: AppPolicy): string {
  let turtle = '';

  const writer = new Writer({
    end: false,
    prefixes: {
      '':     NS,
      vocab:  VOCAB,
      app:    APP,
    },
  });

  // ── Ports and PurposeExpectations for each input ──────────────────────────
  for (const input of policy.inputs) {
    // Port
    writer.addQuad(n(input.port.uri), rdfType, n(`${NS}Port`));
    writer.addQuad(n(input.port.uri), n(`${NS}name`), literal(input.port.name));

    // PurposeExpectations
    for (const pe of input.purposes) {
      writer.addQuad(n(pe.uri), rdfType, n(`${NS}PurposeExpectation`));
      writer.addQuad(n(pe.uri), n(`${NS}name`), n(pe.name));
    }
  }

  // ── Ports for each output ─────────────────────────────────────────────────
  for (const output of policy.outputs) {
    writer.addQuad(n(output.port.uri), rdfType, n(`${NS}Port`));
    writer.addQuad(n(output.port.uri), n(`${NS}name`), literal(output.port.name));
  }

  // ── InputSpec triples ─────────────────────────────────────────────────────
  for (const input of policy.inputs) {
    writer.addQuad(n(input.uri), rdfType, n(`${NS}InputSpec`));
    writer.addQuad(n(input.uri), n(`${NS}data`), n(input.dataUri));
    writer.addQuad(n(input.uri), n(`${NS}port`), n(input.port.uri));

    for (const pe of input.purposes) {
      writer.addQuad(n(input.uri), n(`${NS}purpose`), n(pe.uri));
    }

    for (const sp of input.provides) {
      writer.addQuad(n(sp.uri), rdfType, n(`${NS}SecurityProvide`));
      writer.addQuad(n(sp.uri), n(`${NS}name`), n(sp.name));
      writer.addQuad(n(input.uri), n(`${NS}provide`), n(sp.uri));
    }

    for (const ds of input.downstreams) {
      const dsNode = n(ds.uri);
      writer.addQuad(dsNode, rdfType, n(`${NS}DownstreamSpec`));
      writer.addQuad(dsNode, n(`${NS}app`), n(ds.appName));
      for (const dpe of ds.purposes) {
        writer.addQuad(n(dpe.uri), rdfType, n(`${NS}PurposeExpectation`));
        writer.addQuad(n(dpe.uri), n(`${NS}name`), n(dpe.name));
        writer.addQuad(dsNode, n(`${NS}purpose`), n(dpe.uri));
      }
      writer.addQuad(n(input.uri), n(`${NS}downstream`), dsNode);
    }
  }

  // ── OutputSpec triples ────────────────────────────────────────────────────
  for (const output of policy.outputs) {
    writer.addQuad(n(output.uri), rdfType, n(`${NS}OutputSpec`));
    writer.addQuad(n(output.uri), n(`${NS}port`), n(output.port.uri));

    for (const fromPort of output.fromPorts) {
      writer.addQuad(n(output.uri), n(`${NS}from`), n(fromPort));
    }

    for (const ref of output.refinements) {
      const refNode = blankNode();
      writer.addQuad(n(output.uri), n(`${NS}refinement`), refNode);
      writer.addQuad(refNode, rdfType, n(`${NS}${ref.type}`));
      if (ref.filter?.name)  writer.addQuad(refNode, n(`${NS}name`),  literal(ref.filter.name));
      if (ref.filter?.cls)   writer.addQuad(refNode, n(`${NS}class`), n(ref.filter.cls));
      if (ref.filter?.value) writer.addQuad(refNode, n(`${NS}value`), literal(ref.filter.value));
    }
  }

  // ── AppPolicy root ────────────────────────────────────────────────────────
  writer.addQuad(n(policy.uri), rdfType, n(`${NS}AppPolicy`));
  writer.addQuad(n(policy.uri), n(`${NS}name`), n(policy.appNameUri));

  for (const input of policy.inputs) {
    writer.addQuad(n(policy.uri), n(`${NS}input_spec`), n(input.uri));
  }
  for (const output of policy.outputs) {
    writer.addQuad(n(policy.uri), n(`${NS}output_spec`), n(output.uri));
  }

  writer.end((_err: Error | null, result: string) => { turtle = result; });
  return turtle;
}
