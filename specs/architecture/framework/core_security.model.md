---
tmal-id: template
creator: template
ai-assisted: true
verification-status: unverified
version: template
---

# Security Metamodel

The security model defines binding security principles and patterns for all artefacts in the project. It is complementary to the architecture metamodel and applies to all levels: business architecture, software architecture, APIs, and infrastructure.

It ensures compatibility with the following standards and concepts:

* Zero Trust Architecture (based on NIST SP 800-207)
* OAuth 2.0 / OpenID Connect (RFC 6749, RFC 8693)
* OWASP Top 10 / OWASP API Security Top 10
* Principle of Least Privilege
* Defence in Depth
* Secrets Management (based on NIST SP 800-57)
* Data Classification and Privacy (based on GDPR / ISO 27001)

Further detailing is based on these concepts and standards.

---

## Identity and Access

### Authentication

Every identity — user, service, or process — must authenticate explicitly. Implicit trust based on network location or internal traffic is not permitted.

Authentication is performed via federated, short-lived tokens (Bearer Token). Every component verifies incoming tokens statelessly and cryptographically independently. There is no central session management.

### Authorisation

Authorisation is applied at a fine-grained level per operation and per resource. It is not enforced at the network or platform level, but within the component itself.

The following authorisation levels apply:

- **Operation-Level:** Is the operation permitted for this identity?
- **Resource-Level:** Does the identity have access to exactly this resource?
- **Property-Level:** Which attributes of an Object are visible or writable for this identity? Attributes with a higher data classification than the role permits are neither returned nor accepted.
- **Context-Level:** Are the contextual conditions (time window, origin, risk level) satisfied?

Permissions are transported as claims in the token and are not loaded from a central database at runtime unless explicitly required.

### Identity Types and User Groups

Every identity in the system is assigned to exactly one identity type. The identity type determines which authentication form and which role structure applies.

The following canonical identity types apply:

- `human_user`: a natural person interacting with the system via an interactive channel
- `service_account`: a technical identity for automated service-to-service communication
- `process_account`: a technical identity for orchestrated process runs
- `external_user`: an identity from an externally federated identity domain

User groups bundle `human_user` identities by business affiliation. An identity may belong to multiple user groups. Permissions are not assigned directly to identities but to roles.

### Roles

Roles define the permitted behaviour of an identity towards components and their operations. They are transported as claims in the token.

The following principles apply:

- Each role bundles a coherent set of permissions by business responsibility.
- An identity may carry multiple roles; the most restrictive data classification rule takes precedence.
- Roles are not evaluated system-wide but component-specifically.
- Privileged roles (e.g. administrators) are subject to additional contextual conditions (multi-factor authentication, time window, audit logging).
- Role assignments are managed in a versioned and auditable manner.

---

## Zero Trust

Every communication between components — even within the same application or the same network — is treated as communication over an untrusted connection.

The following principles apply:

- **Verify explicitly:** Every request is fully authenticated and authorised, regardless of source or path.
- **Use least privilege access:** Every identity receives only the minimum permissions necessary for exactly the required time period.
- **Assume breach:** The system is designed as if parts of it may already be compromised. Lateral movement is prevented through strict component isolation.

---

## Data Classification and Privacy

Every Business Object and every Object implicitly carries a data classification. The classification determines encryption requirements, access logging, and retention periods.

The following canonical data classification levels apply:

- `public`: no restriction
- `internal`: authenticated identities within the system only
- `confidential`: authorised roles only; logging mandatory
- `restricted`: highest protection level; encryption at-rest and in-transit mandatory; access restricted to explicitly named identities

The data classification of an Object inherits at minimum the class of its parent Business Object. A lower class than the Business Object is not permitted.

### Classification under GDPR and EU Directives

Data and documents containing personal data are subject to the General Data Protection Regulation (GDPR, Regulation (EU) 2016/679) and applicable sector-specific EU directives (e.g. NIS2 Directive 2022/2555, ePrivacy). Compliance with these requirements is mandatory and is operationalised through the data classification.

The following additional rules apply to personal data:

- **Personal data** (Art. 4 GDPR): minimum class `confidential`. Processing only on the basis of a legal ground under Art. 6 GDPR.
- **Special categories of personal data** (Art. 9 GDPR, e.g. health data, biometric data, religious beliefs): minimum class `restricted`. Processing only on the basis of Art. 9(2) GDPR.
- **Purpose limitation:** Data may only be processed for the purpose determined at the time of collection. Use for unrelated purposes is excluded.
- **Data minimisation:** Only data necessary for the respective purpose is collected and processed (Art. 5(1)(c) GDPR).
- **Storage limitation:** Retention periods must be defined per Business Object and Object and enforced technically (Art. 5(1)(e) GDPR).
- **Data subject rights:** The architecture must technically enable access, rectification, erasure, and data portability per Business Object (Art. 15–20 GDPR).

The same classification rules apply to documents as to structured data. The classification of a document is determined by the most sensitive data item it contains.

---

## Secrets Management

Secrets (credentials, API keys, certificates, tokens) must not be stored in source code, configuration files, or build artefacts.

The following rules apply:

- Secrets are injected exclusively at runtime from a dedicated secrets store.
- Secrets have a defined maximum lifetime (rotation).
- Access to secrets is restricted per component and per deployment context.
- Expired or compromised secrets are actively revoked.

---

## Security in the Architecture Model

### Mapping to Component Types

Security responsibility is not centralised in a dedicated security component, but is an inherent part of every component:

- `business_component`: authorisation at resource and property level; data classification of all managed Objects must be declared.
- `channel_component`: authentication of the incoming caller; propagation of identity context to downstream components; rate limiting and quota per identity and operation are mandatory.
- `adapter_component`: encapsulation of external authentication mechanisms; no propagation of external credentials inward; outbound connections only to explicitly permitted targets (allow-list); no dynamic URL resolution based on input data.
- `process_component`: forwarding of identity context; no independent authorisation decision.

### Mapping to Service Types

- `data_service`: access via authorised operations only; write operations are logged.
- `adapter_service`: credentials for the external API are sourced exclusively from the secrets store.
- `subprocess_service`: inherits the identity context of the calling process; no privilege escalation.
- `basic_service`: minimal when stateless and without data access; if accessing `confidential` data, authorisation is mandatory.

### APIs

Every API operation explicitly declares:

- Which authentication form is expected (Bearer Token, API Key, mTLS).
- Which authorisation condition must be met (role, scope, claim).
- Which data classification the returned data carries.

### Input Validation

All incoming data is fully validated at API boundaries before it is processed or forwarded. This applies in particular to `adapter_service` and `data_service` entry points.

- Inputs are validated against a defined schema (type, format, value range).
- Unexpected fields are rejected, not silently ignored.
- Raw input data is never passed directly into persistence, query, or template mechanisms.

---

## Audit Logging and Monitoring

Security-relevant events are logged completely, tamper-evidently, and in a structured format. Logs are not a debugging tool but a forensic and operational audit record.

The following events must be logged:

- Authentication events (success and failure).
- Authorisation denials.
- All write operations on `confidential` and `restricted` data.
- Access to privileged roles and secrets.
- Outbound connections from `adapter_service` to external systems.

Log entries must contain at minimum: timestamp, identity, process (process_id), component, service (operation), resource, and result. Personal data is captured in logs only to the extent necessary (data minimisation).

## Alerting

Anomaly patterns (e.g. repeated authentication failures, unusual access volumes) trigger alerts.

---

## Terms and Naming Rules

Canonical security classes and types are named in `snake_case` and are to be used normatively in specifications: `public`, `internal`, `confidential`, `restricted`.

Technical security artefacts (token claims, scope names, secret paths) follow the same naming conventions as defined in the architecture metamodel: no special characters, no spaces, no project-external prefixes or suffixes.
