---
tmal-id: template
creator: template
ai-assisted: true
verification-status: unverified
version: template
---

# Architecture Metamodel

The architecture model ensures unambiguous, fully automated transformability between business specification and technical implementation. It simultaneously ensures compatibility with the following concepts:

* Domain-Driven Design (DDD)
* Event-Driven Architecture (EDA)
* Command Query Responsibility Segregation (CQRS)
* Self-Contained Systems (SCS)
* Hexagonal Architecture (Ports & Adapters) / Clean Architecture
* Microservices based, API-first, Cloud-native SaaS and Headless (MACH)
* Micro-Frontends / Vertical Slices
* SAGA (transactional behaviour)
* Containerisation according to OCI standard (Open Container Initiative)
* Zero Trust Architecture (aligned with NIST SP 800-207)
* OAuth 2.0 / OpenID Connect
* DevOps 2.0 Lifecycle Model (BizDevOps)
* C4 (Context, Containers, Components, Code)

Further detail is elaborated on the basis of these concepts and standards.

## Business Architecture Model

* **Functional structure:** Domain --> Subdomain --> Component --> Service
* **Data structure:** Business Object --> Object --> Attribute
* **Process structure:** Process --> Subprocess

A Domain forms the business and organisational bracket over Subdomains but has no direct technical runtime unit itself. Each Subdomain is defined by exactly one Business Object.

A Component bundles the business responsibility of a Subdomain in a clearly bounded unit and contains several Services, but only one writing Service with an Object reference in the sense of CQRS. A Component also contains its own frontend alongside its services when this is required for business interaction.

A Service is a functional offering for a Process, contains at most one Object, and uses either Command, Event, or Query as a communication pattern. Within a Component there may only be one Service with a persistent Business Object, which is then also the Business Object of the Component and Subdomain. This Service is of Service type `data_service`.

Every Business Object and Object requires an attribute with a unique ID (`name_id`) and an attribute with a globally unique UUID (`name_uuid`).

A Process controls Services and Subprocesses across subdomain boundaries and is therefore an orchestration entity. Subprocesses are Services of type `subprocess_service` and belong to a Component. They are only of type `subprocess_service` if their processing in turn requires calling other Services within a Component. Services that do not call other Services themselves and have no persistent Business Objects are of Service type `basic_service`. A Process that controls Services across Component boundaries is not modelled as its own Service type, but as a Process within a `process_component`.

A Service — and therefore also a Subprocess — is unambiguously assigned to exactly one Component.
All Business Objects and every Object are uniquely identifiable across domain boundaries via a business ID.

Services can also act as adapters for connecting to external APIs and other interfaces. In this case the Service type is `adapter_service`.


### Component Scoping

Components are as business-independent of each other as possible and encapsulate their functionality. Each Component is defined by exactly one leading Business Object. The Component may only contain additional Business Objects or Objects if these are directly connected to the leading Business Object and its Services from a business perspective.

Interfaces to foreign domains are implemented via independent Components (`adapter_component`) that behave towards Processes as if they were part of the same domain.

Components only orchestrate their own Services (via `subprocess_service`). Cross-component orchestration of Services is done via special process components (`process_component`).

The following Component types apply:

- `business_component`: provides business Services for Processes
- `channel_component`: encapsulates a business channel, e.g. frontend, communication channel towards other components
- `frontend_component`: provides channel-bound frontend interaction and is assigned to exactly one `channel_component`
- `adapter_component`: encapsulates a foreign domain, a third-party system, or an external API
- `process_component`: orchestrates Processes or Subprocesses without its own persistent state

\---

### Service Scoping and Service Types

Services are designed primarily from the Component's perspective and are stateless.

The following rules apply to Services:

- Reusability across the totality of Processes is maximised.
- Services do not call Services outside their own Component, except `subprocess_service`.
- The ideal naming of a Service follows the pattern `object_verb`.
- Services of type `adapter_service` that face outward align their cut and data model with the data source and provide standardised Services internally.
- There are Services for reading and writing on the leading Business Object as a standard, except for `process_component`.
- Additional Services are only permitted if their logic is object-inherent and not process-specific.
- More complex object-inherent process logic can be modelled as `subprocess_service`.

The following canonical Service types exist:

- `subprocess_service`: orchestrates multiple Services within a Component
- `basic_service`: encapsulates business logic or computation without persistent data management
- `data_service`: encapsulates the persistent business data management of the leading Business Object
- `adapter_service`: encapsulates third-party systems, external APIs, or proprietary interfaces


\---

### Process Interface

Processes are aligned with the concerns of their callers (`channel_components`) but are designed channel-independently. Processes can bundle similar concerns. These concerns can be addressed within a Process through process variants. If the business and technical overlap of process variants is low, this is an indicator to separate them into independent Processes.

\---


### Omnichannel Architecture

Entry channels are represented by independent business Components of type `channel_component`. Channel Components know the business-permissible Processes for their respective use case and trigger them directly via their API.

Differences between channels lie in intake, authentication, document, dialogue, and presentation logic. The business Process interfaces remain consistent across channels.

All Processes are designed for cross-channel usability without incorporating channel specifics. Channel specifics are represented exclusively in `channel_component`.


## Software Architecture Model

The following concepts are derived 1:1 from the business architecture and are interpreted technically here: Application Cluster as the technical counterpart of Domain, and Application as the technical counterpart of Subdomain. Component, Service, Object, Attribute, Process, and Subprocess are adopted with the same names from the business architecture.

* **Functional structure:** Application Cluster --> Application --> Component (Micro-Service) --> Service
* **Data structure:** Object --> Attribute
* **Process structure:** Process --> Subprocess

Every Object is uniquely identifiable across domain boundaries via a technical UUID and contains the technical UUID of its Business Object in the form of a reference.

The Application Cluster represents the technical manifestation of a Domain as a federation of multiple Applications. Each business Subdomain becomes exactly one Application technically. The Application forms the technical system context across multiple Components and is developed in a defined technology stack.

A Component is a Micro-Service and at the same time the primary technical container in the C4 sense. It is packaged as an isolated, immutable container (Immutable Infrastructure), has an independent release cycle, and has no runtime dependencies on other Components except via APIs. In this approach there are no cross-application platforms, layers, databases, or infrastructures (cf. "Shared Nothing" approach).

Within a Component, database access is encapsulated via a Data Access Layer. The persistent state is logically isolated in Component-specific schemas (Logical Database Separation). Physically, these schemas can reside on the same DBMS of the Application.

Every communication between Components, even within the same Application, requires strict authentication and authorisation. This can be done in a decentralised manner via federated tokens that are verified by each Component statelessly and cryptographically independently. Access is granted on a per-session basis. All communication is secured independently of the network location (cf. Zero Trust Architecture).

A Component integrates with its environment via the API it provides and the frontend assigned to it, if this is required for business interaction.

A Process is an orchestration entity of the business architecture and is represented by exactly one `process_component` of the software architecture, which exclusively controls APIs of other components. A `process_component` must not itself contain any business logic and no transformations other than the forwarding of data or control functionality necessary for orchestration, e.g. split & merge. An orchestrator is not a cross-component runtime platform, but can provide cross-cutting functionality (e.g. monitoring, alerting) via an independent Component.

\---

### Frontend Components

Every frontend is a Component of type `frontend_component` and provides channel-bound frontend interaction. It is assigned to exactly one corresponding backend Component of type `channel_component`.

Frontends do not communicate cross-component, but only via their own `channel_component`, which aggregates the functionality of other Components via APIs.

## APIs

Each Component has an API; every Service within that Component is an operation of this API. Foreign APIs and other proprietary interfaces are encapsulated via adapter components (Anti-Corruption Layer). The component APIs (including adapter components) are referred to as internal components (with internal API). The APIs provided by external providers that are encapsulated by the component adapters are referred to as external APIs.

\---

### API Principles

* APIs make concrete the business interactions between Processes and Components, or channels and Components.
* Every Service within a Component is addressed via at least one business operation on the API of that Component.

### REST and Messaging APIs

APIs are the integration points between Processes and Components. Both REST and Messaging APIs are understood as APIs here. An API belongs to exactly one Component and is structured according to the following schema:

* Endpoint
    ** REST: URL according to the schema `https://{organisation}.com/{application}/{component}/api/{operation}`
    ** Messaging infrastructure: `{topic}` topic
    ** Bearer API key
* Communication patterns:
    * Query:
        * GET
    * Command:
        * Application-internal: POST
        * Cross-application: Message
    * Event:
        * Application-internal: POST (Webhook)
        * Cross-application: Message
        * Event types:
            * Document Event (Event-Carried State Transfer)
            * Notification Event
    * Modifier (only permitted within a Component):
        * PUT (replace)
        * PATCH (partial update)
* Data schema

Events and Commands are specified as POST. From this, the Message specification of the Messaging infrastructure for cross-domain usability of Commands and Events is derived. This closes the gap between synchronous documentation (OpenAPI/Swagger) and asynchronous runtime (EDA).

\---

### Mapping of Communication Patterns to Service Types

- `subprocess_service`: is triggered via a Command and returns feedback as an Event
- `basic_service`: is primarily represented as a Query
- `data_service`: is primarily represented as a Query or Command on the leading Business Object
- `adapter_service`: maps the communication pattern of the encapsulated foreign interface outward and provides standardised Commands, Events, or Queries internally

## Terms and Naming Rules

The concrete names of Domains, Subdomains, Components, Services, Processes, Subprocesses, Business Objects, Objects, and Attributes are consistently named in `snake_case` throughout the repository.

Technical names:

- contain no umlauts
- use no spaces
- carry no additional prefixes or suffixes that are not derived from this metamodel

The goal is consistent technical traceability into APIs, schemas, messaging structures, and persistence models. Consistency and compatibility take precedence over the usual naming conventions of frameworks and programming languages. The normatively used type names of the metamodel such as `business_component`, `channel_component`, `frontend_component`, `subprocess_service`, `data_service`, or `adapter_service` are permissible canonical identifiers.

Descriptive business language in prose text may deviate from this.
