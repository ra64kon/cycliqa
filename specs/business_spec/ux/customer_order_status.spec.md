---
tmal-id: FA-UX-001-BREW
creator: user_experience_architect
ai-assisted: true
verification-status: unverified
version: 0.1.2
---

# UX View: Customer, Order, and Status

## Goal

The customer view describes how input, feedback, and status are connected from a business perspective in the CoffeeToGo example.

## User Role

`Customer`

## Interaction Steps

1. Establish a web session for the channel.
2. Specify coffee with type, milk foam option, and customer name via the web channel.
3. Receive confirmation with order ID and process ID.
4. Track the live progress of the flow via the web channel or retrieve the final order status via the web channel.
5. View the completed delivery status.

## Leading Business Objects

- `Order ID`
- `Process ID`
- `Beverage Type`
- `Milk Foam Option`
- `Customer Name`
- `Order Status`
- `Process Status`

## Feedback

- On acceptance: order ID, process ID, and status `accepted`.
- During the flow: `process_control` returns status `running` and the last completed step.
- In the current demo setup, the order status itself remains `accepted` until the final result.
- After successful delivery: status `delivered`.
- After failed delivery: status `delivery_escalated` (manual clarification required).
- The web channel provides a valid bearer token for the interaction.
- On invalid input: business-friendly rejection with correction hint.

## Correction and Error Paths

- Missing customer name prevents acceptance.
- Unknown beverage type prevents acceptance.
- Invalid milk foam option prevents acceptance.
- A missing or expired web session prevents use of the channel.
- The delivery destination is not part of customer input in the current demo; it is preset internally in the system.
- Errors in preparation or delivery must remain visible to the customer as unsuccessful.

## Connection

The business interaction view is further elaborated in `../ux/`, the associated business specifications under `../`, and the technical derivations under `../../software_spec/`.
