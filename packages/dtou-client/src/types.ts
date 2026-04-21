// ── App Policy types ────────────────────────────────────────────────────────

export interface Port {
  uri: string;
  name: string;   // :name string value
}

export interface PurposeExpectation {
  uri: string;    // resource IRI (shared vocab, e.g. vocab:provide-health-suggestions)
  name: string;   // :name — shared concept URI (e.g. urn:dtou-demo:purpose-health-suggestions)
}

export interface SecurityProvide {
  uri: string;
  name: string;
}

export interface DownstreamSpec {
  uri: string;
  appName: string;
  purposes: PurposeExpectation[];
}

export interface AppInputSpec {
  uri: string;
  dataUri: string;
  port: Port;
  purposes: PurposeExpectation[];
  provides: SecurityProvide[];
  downstreams: DownstreamSpec[];
}

export interface Refinement {
  type: 'Delete' | 'Edit';
  filter?: { name?: string; cls?: string; value?: string };
}

export interface AppOutputSpec {
  uri: string;
  port: Port;
  fromPorts: string[];   // input port URIs
  refinements: Refinement[];
}

/** The full app policy — serialized to Turtle and sent to the server */
export interface AppPolicy {
  uri: string;           // IRI of the :AppPolicy resource
  appNameUri: string;    // :name — the app's identifying URI
  appDisplayName: string;
  description: string;
  inputs: AppInputSpec[];
  outputs: AppOutputSpec[];
}

// ── Reasoning result types (returned by the server) ─────────────────────────

export type ConflictType =
  | 'ProhibitedUse'
  | 'UnsatisfiedRequirement'
  | 'UnmatchedExpectation';

export interface Conflict {
  type: ConflictType;
  detail: string;
}

export interface ActivatedObligation {
  obligationClass: string;
  triggeredByPurpose: string;
  args: string[];
}

export interface CompatibilityResult {
  compatible: boolean;
  conflicts: Conflict[];
  activatedObligations: ActivatedObligation[];
  summary: string;
}

// ── Display-only types (for the UI policy panel) ─────────────────────────────

/** A parsed data policy fetched for UI display purposes only */
export interface DataPolicyDisplay {
  resourceUrl: string;
  raw: string;           // raw Turtle text shown in the UI
}
