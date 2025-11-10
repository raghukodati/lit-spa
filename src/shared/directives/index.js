/**
 * Lit Directives - Central export for all Lit template directives
 * 
 * These directives provide powerful dynamic templating capabilities:
 * - repeat: Efficient list rendering with keys
 * - until: Async content with loading states
 * - classMap: Conditional CSS classes
 * - styleMap: Dynamic inline styles
 * - ref: Direct DOM element access
 * - live: Force property updates
 * - ifDefined: Conditionally set attributes
 * - cache: Cache template results
 * - guard: Prevent re-renders
 * - when: Conditional rendering
 */

// Import from lit/directives
import { repeat as repeatDirective } from 'lit/directives/repeat.js';
import { until as untilDirective } from 'lit/directives/until.js';
import { classMap as classMapDirective } from 'lit/directives/class-map.js';
import { styleMap as styleMapDirective } from 'lit/directives/style-map.js';
import { ref as refDirective, createRef as createRefDirective } from 'lit/directives/ref.js';
import { live as liveDirective } from 'lit/directives/live.js';
import { ifDefined as ifDefinedDirective } from 'lit/directives/if-defined.js';
import { cache as cacheDirective } from 'lit/directives/cache.js';
import { guard as guardDirective } from 'lit/directives/guard.js';
import { when as whenDirective } from 'lit/directives/when.js';
import { choose as chooseDirective } from 'lit/directives/choose.js';
import { map as mapDirective } from 'lit/directives/map.js';
import { range as rangeDirective } from 'lit/directives/range.js';
import { join as joinDirective } from 'lit/directives/join.js';
import { keyed as keyedDirective } from 'lit/directives/keyed.js';
import { asyncAppend as asyncAppendDirective } from 'lit/directives/async-append.js';
import { asyncReplace as asyncReplaceDirective } from 'lit/directives/async-replace.js';
import { templateContent as templateContentDirective } from 'lit/directives/template-content.js';
import { unsafeHTML as unsafeHTMLDirective } from 'lit/directives/unsafe-html.js';
import { unsafeSVG as unsafeSVGDirective } from 'lit/directives/unsafe-svg.js';

// Re-export with clean names
export const repeat = repeatDirective;
export const until = untilDirective;
export const classMap = classMapDirective;
export const styleMap = styleMapDirective;
export const ref = refDirective;
export const createRef = createRefDirective;
export const live = liveDirective;
export const ifDefined = ifDefinedDirective;
export const cache = cacheDirective;
export const guard = guardDirective;
export const when = whenDirective;
export const choose = chooseDirective;
export const map = mapDirective;
export const range = rangeDirective;
export const join = joinDirective;
export const keyed = keyedDirective;
export const asyncAppend = asyncAppendDirective;
export const asyncReplace = asyncReplaceDirective;
export const templateContent = templateContentDirective;
export const unsafeHTML = unsafeHTMLDirective;
export const unsafeSVG = unsafeSVGDirective;

/**
 * Usage Examples:
 * 
 * // repeat - Efficient list rendering
 * ${repeat(items, (item) => item.id, (item, index) => html`
 *   <div>${item.name}</div>
 * `)}
 * 
 * // until - Async content
 * ${until(fetchData(), html`<div>Loading...</div>`)}
 * 
 * // classMap - Conditional classes
 * <div class=${classMap({ active: isActive, disabled: !enabled })}></div>
 * 
 * // styleMap - Dynamic styles
 * <div style=${styleMap({ color: textColor, fontSize: `${size}px` })}></div>
 * 
 * // ref - DOM element reference
 * <input ${ref(this.inputRef)} />
 * 
 * // live - Force property updates
 * <input .value=${live(this.value)} />
 * 
 * // when - Conditional rendering
 * ${when(condition, () => html`<div>True</div>`, () => html`<div>False</div>`)}
 * 
 * // guard - Prevent re-renders
 * ${guard([data], () => expensiveRender(data))}
 */

export default {
  repeat,
  until,
  classMap,
  styleMap,
  ref,
  createRef,
  live,
  ifDefined,
  cache,
  guard,
  when,
  choose,
  map,
  range,
  join,
  keyed,
  asyncAppend,
  asyncReplace,
  templateContent,
  unsafeHTML,
  unsafeSVG
};
