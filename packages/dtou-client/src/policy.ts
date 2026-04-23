import { Writer, DataFactory } from 'n3';
import type { AppPolicy } from './types.js';

const { namedNode, literal, blankNode } = DataFactory;

// The canonical DToU core namespace used by the reasoning rules and server.
const DTOU = 'urn:dtou:core#';
const APP  = 'http://example.org/app#';

const rdfType = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');

function n(iri: string) { return namedNode(iri); }

/**
 * Serialize an AppPolicy to Turtle using the urn:dtou:core# vocabulary,
 * which is the namespace expected by the solid-dtou reasoning rules.
 *
 * Changes from the original (http://example.org/ns#) version:
 *  - All DToU types/predicates use urn:dtou:core# namespace
 *  - PurposeExpectation concept emitted as dtou:descriptor (not dtou:name)
 *  - SecurityProvide concept emitted as dtou:descriptor (not dtou:name)
 *  - Refinement filter is a separate dtou:Filter blank node linked via dtou:filter
 *  - DownstreamSpec uses dtou:app_name (not dtou:app)
 */
export function serializeAppPolicy(policy: AppPolicy): string {
  let turtle = '';

  const writer = new Writer({
    end: false,
    prefixes: {
      dtou: DTOU,
      app:  APP,
    },
  });

  // ── Ports and PurposeExpectations for each input ──────────────────────────
  for (const input of policy.inputs) {
    writer.addQuad(n(input.port.uri), rdfType, n(`${DTOU}Port`));
    writer.addQuad(n(input.port.uri), n(`${DTOU}name`), literal(input.port.name));

    // Concept URI goes on dtou:descriptor, not dtou:name
    for (const pe of input.purposes) {
      writer.addQuad(n(pe.uri), rdfType, n(`${DTOU}PurposeExpectation`));
      writer.addQuad(n(pe.uri), n(`${DTOU}descriptor`), n(pe.name));
    }
  }

  // ── Ports for each output ─────────────────────────────────────────────────
  for (const output of policy.outputs) {
    writer.addQuad(n(output.port.uri), rdfType, n(`${DTOU}Port`));
    writer.addQuad(n(output.port.uri), n(`${DTOU}name`), literal(output.port.name));
  }

  // ── InputSpec triples ─────────────────────────────────────────────────────
  for (const input of policy.inputs) {
    writer.addQuad(n(input.uri), rdfType, n(`${DTOU}InputSpec`));
    writer.addQuad(n(input.uri), n(`${DTOU}data`), n(input.dataUri));
    writer.addQuad(n(input.uri), n(`${DTOU}port`), n(input.port.uri));

    for (const pe of input.purposes) {
      writer.addQuad(n(input.uri), n(`${DTOU}purpose`), n(pe.uri));
    }

    for (const sp of input.provides) {
      writer.addQuad(n(sp.uri), rdfType, n(`${DTOU}SecurityProvide`));
      writer.addQuad(n(sp.uri), n(`${DTOU}descriptor`), n(sp.name));
      writer.addQuad(n(input.uri), n(`${DTOU}provide`), n(sp.uri));
    }

    for (const ds of input.downstreams) {
      const dsNode = n(ds.uri);
      writer.addQuad(dsNode, rdfType, n(`${DTOU}DownstreamSpec`));
      writer.addQuad(dsNode, n(`${DTOU}app_name`), n(ds.appName));
      for (const dpe of ds.purposes) {
        writer.addQuad(n(dpe.uri), rdfType, n(`${DTOU}PurposeExpectation`));
        writer.addQuad(n(dpe.uri), n(`${DTOU}descriptor`), n(dpe.name));
        writer.addQuad(dsNode, n(`${DTOU}purpose`), n(dpe.uri));
      }
      writer.addQuad(n(input.uri), n(`${DTOU}downstream`), dsNode);
    }
  }

  // ── OutputSpec triples ────────────────────────────────────────────────────
  for (const output of policy.outputs) {
    writer.addQuad(n(output.uri), rdfType, n(`${DTOU}OutputSpec`));
    writer.addQuad(n(output.uri), n(`${DTOU}port`), n(output.port.uri));

    for (const fromPort of output.fromPorts) {
      writer.addQuad(n(output.uri), n(`${DTOU}from`), n(fromPort));
    }

    for (const ref of output.refinements) {
      const refNode = blankNode();
      writer.addQuad(n(output.uri), n(`${DTOU}refinement`), refNode);
      writer.addQuad(refNode, rdfType, n(`${DTOU}${ref.type}`));
      if (ref.filter) {
        const filterNode = blankNode();
        writer.addQuad(refNode, n(`${DTOU}filter`), filterNode);
        writer.addQuad(filterNode, rdfType, n(`${DTOU}Filter`));
        if (ref.filter.name)  writer.addQuad(filterNode, n(`${DTOU}name`),  n(ref.filter.name));
        if (ref.filter.cls)   writer.addQuad(filterNode, n(`${DTOU}class`), n(ref.filter.cls));
        if (ref.filter.value) writer.addQuad(filterNode, n(`${DTOU}value`), n(ref.filter.value));
      }
    }
  }

  // ── AppPolicy root ────────────────────────────────────────────────────────
  writer.addQuad(n(policy.uri), rdfType, n(`${DTOU}AppPolicy`));
  writer.addQuad(n(policy.uri), n(`${DTOU}name`), n(policy.appNameUri));

  for (const input of policy.inputs) {
    writer.addQuad(n(policy.uri), n(`${DTOU}input_spec`), n(input.uri));
  }
  for (const output of policy.outputs) {
    writer.addQuad(n(policy.uri), n(`${DTOU}output_spec`), n(output.uri));
  }

  writer.end((_err: Error | null, result: string) => { turtle = result; });
  return turtle;
}
