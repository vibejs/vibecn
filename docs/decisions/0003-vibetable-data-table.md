# 0003. VibeTable source composition

Status: Accepted

Supersedes the Data Table composition-only statement in decision 0002.

VibeTable provides the Vibe.js-native adapter for TanStack Table Core 9.3.1. Vibecn remains
an independent source installer: `vibecn add data-table` copies the reusable DataTable pattern,
its structural type utility and existing primitive dependencies. It reports the adapter package
as a required dependency without editing manifests or executing a package manager. All source
remains editable by the application.

Core owns row models and state; VibeTable owns native atom/option synchronization; Vibecn owns
semantic markup, styling and controls. Existing Table primitives are unchanged. There is no
React or Vue dependency and no use of @usevibejs/ui/internal. Typed application components are
registered through componentRenderer and mounted declaratively by consumer-compiled source.

Vibe has no generic SFC syntax. Component table props use structural, feature-optional read
interfaces; slot row originals are unknown. Application cell components retain exact row and
value contexts. Features and initial state are static according to Core v9; reactive state/data
uses the adapter's public contract.

The payments example replaces its handwritten transforms with a real reactive table. Existing
component and production-browser tests now exercise that implementation, and the generic
component suite supplies required table/context inputs. Loading/error/empty rendering and
keyboard/pointer sizing are tested. Resize handlers receive a scoped document through Core's public context argument; mouse and touch terminal callbacks are invoked on unmount to release document listeners and pending animation work. The local workspace override connects the separately built
adapter for site development. No package publication or remote action is part of this change.
