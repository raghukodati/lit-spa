import{T as r,N as e}from"./index-e1bWKrj6.js";class n extends r{static properties={title:{type:String},subtitle:{type:String},variant:{type:String}};constructor(){super(),this.title="",this.subtitle="",this.variant=""}createRenderRoot(){return this}renderHeader(){const t=!!this.querySelector('[slot="header"]')||!!this.querySelector('[slot="actions"]');return!this.title&&!this.subtitle&&!t?null:e`
      <div class="card-header d-flex align-items-center justify-content-between">
        <div>
          ${this.title?e`<h5 class="card-title m-0">${this.title}</h5>`:""}
          ${this.subtitle?e`<div class="card-subtitle text-muted">${this.subtitle}</div>`:""}
          <slot name="header"></slot>
        </div>
        <div class="card-actions d-flex align-items-center gap-2">
          <slot name="actions"></slot>
        </div>
      </div>
    `}renderFooter(){return!this.querySelector('[slot="footer"]')?null:e`
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
    `}render(){const t=["card"];return this.variant==="outline"&&t.push("border"),this.variant==="flush"&&t.push("border-0"),e`
      <div class="${t.join(" ")}">
        ${this.renderHeader()}
        <div class="card-body">
          <slot></slot>
        </div>
        ${this.renderFooter()}
      </div>
    `}}customElements.define("ui-card",n);class o extends r{static properties={columns:{type:Array},items:{type:Array},loading:{type:Boolean},emptyText:{type:String},page:{type:Number},pageSize:{type:Number},total:{type:Number},sortBy:{type:String},sortOrder:{type:String}};constructor(){super(),this.columns=[],this.items=[],this.loading=!1,this.emptyText="No data",this.page=1,this.pageSize=10,this.total=0,this.sortBy="",this.sortOrder="asc"}createRenderRoot(){return this}onHeaderClick(t){if(!t.sortable)return;let i=t.key,s=this.sortOrder;this.sortBy===t.key?s=this.sortOrder==="asc"?"desc":"asc":s="asc",this.dispatchEvent(new CustomEvent("table-sort",{detail:{sortBy:i,sortOrder:s},bubbles:!0}))}goTo(t){const i=Math.max(1,Math.ceil(this.total/this.pageSize)),s=Math.min(Math.max(1,t),i);this.dispatchEvent(new CustomEvent("table-page",{detail:{page:s},bubbles:!0}))}renderHeader(){return e`
      <thead>
        <tr>
          ${this.columns.map(t=>e`
            <th
              role="${t.sortable?"button":"columnheader"}"
              scope="col"
              @click="${()=>this.onHeaderClick(t)}"
              class="${t.sortable?"user-select-none":""}"
            >
              <span class="d-inline-flex align-items-center gap-1">
                ${t.label??t.key}
                ${t.sortable?e`
                  <i class="bi ${this.sortBy===t.key?this.sortOrder==="asc"?"bi-caret-up-fill":"bi-caret-down-fill":"bi-chevron-expand"}"></i>
                `:""}
              </span>
            </th>
          `)}
        </tr>
      </thead>
    `}renderBody(){return this.loading?e`
        <tbody>
          <tr><td colspan="${this.columns.length}" class="text-center py-5">
            <div class="spinner-border" role="status"></div>
          </td></tr>
        </tbody>
      `:this.items?.length?e`
      <tbody>
        ${this.items.map(t=>e`
          <tr>
            ${this.columns.map(i=>e`
              <td>
                ${i.render?i.render(t):t?.[i.key]??""}
              </td>
            `)}
          </tr>
        `)}
      </tbody>
    `:e`
        <tbody>
          <tr><td colspan="${this.columns.length}" class="text-center py-4">
            ${this.emptyText}
          </td></tr>
        </tbody>
      `}renderPagination(){const t=Math.max(1,Math.ceil(this.total/this.pageSize));if(t<=1)return null;const i=Array.from({length:t},(s,l)=>l+1);return e`
      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item ${this.page===1?"disabled":""}">
            <a class="page-link" @click="${()=>this.goTo(this.page-1)}">Previous</a>
          </li>
          ${i.map(s=>e`
            <li class="page-item ${this.page===s?"active":""}">
              <a class="page-link" @click="${()=>this.goTo(s)}">${s}</a>
            </li>
          `)}
          <li class="page-item ${this.page===t?"disabled":""}">
            <a class="page-link" @click="${()=>this.goTo(this.page+1)}">Next</a>
          </li>
        </ul>
      </nav>
    `}render(){return e`
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          ${this.renderHeader()}
          ${this.renderBody()}
        </table>
      </div>
      ${this.renderPagination()}
      <div class="text-center text-muted mt-2">
        ${this.items?.length??0} of ${this.total} items
      </div>
    `}}customElements.define("ui-table",o);
