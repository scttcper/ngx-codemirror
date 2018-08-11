import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer mb-4 mt-5">
    <div class="mb-1">
      <mdo-github-button
        count="true"
        user="typectrl"
        repo="ngx-codemirror"
        >
      </mdo-github-button>
    </div>
    Angular {{ version }}
    <br>
    Released under the
    <a href="https://github.com/typectrl/ngx-codemirror/blob/master/LICENSE">MIT</a> license
    -
    <a href="https://github.com/typectrl/ngx-codemirror">View source</a>
    <br>
    Listed on <a href="https://angular.parts/package/@ctrl/ngx-codemirror">angular.parts</a>
  </footer>
  `,
  styles: [
    `
      .footer {
        line-height: 2;
        text-align: center;
        font-size: 70%;
        color: #999;
        font-family: var(--font-family-monospace);
      }
    `,
  ],
})
export class FooterComponent {
  version = VERSION.full;
}
