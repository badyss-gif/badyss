// Shared pixel heights for the fixed top-bar + header stack. Centralized so
// every consumer that needs to offset content beneath the fixed stack (the
// Header's own non-homepage spacer, any future page-level padding) agrees on
// the same numbers instead of hardcoding `100px` in multiple places.
export const TOPBAR_HEIGHT = 36;
export const HEADER_HEIGHT = 64;
export const FIXED_STACK_HEIGHT = TOPBAR_HEIGHT + HEADER_HEIGHT;
