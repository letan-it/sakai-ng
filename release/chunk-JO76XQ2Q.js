import{s as oe}from"./chunk-ATZ5QWAF.js";import{Eb as ae,Na as ee,Oa as E,Pa as te,Va as S,Ya as ne,f as J,h as W,kb as ie,l as X,p as Z,yb as re}from"./chunk-4QJ5GKRY.js";import{Aa as _,Dc as U,Eb as a,Fb as v,Gb as x,Hb as H,Ic as Y,Lb as V,Mb as F,Mc as M,Ob as C,Sb as g,Ub as r,Uc as b,Va as B,Vb as $,Wb as L,Xb as D,Za as l,Zb as R,_b as P,bc as Q,ca as I,cc as K,da as w,fc as s,gc as q,ha as h,hc as G,ib as N,jb as k,kb as O,ma as d,mb as T,na as p,oa as j,ob as u,pc as z,qb as y,yb as m,za as A}from"./chunk-UFNSFZ2P.js";var ce=`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`;var ue=`
    ${ce}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,me={root:({instance:t})=>["p-textarea p-component",{"p-filled":t.$filled(),"p-textarea-resizable ":t.autoResize,"p-variant-filled":t.$variant()==="filled","p-textarea-fluid":t.hasFluid,"p-inputfield-sm p-textarea-sm":t.pSize==="small","p-textarea-lg p-inputfield-lg":t.pSize==="large","p-invalid":t.invalid()}]},le=(()=>{class t extends S{name="textarea";theme=ue;classes=me;static \u0275fac=(()=>{let e;return function(i){return(e||(e=_(t)))(i||t)}})();static \u0275prov=I({token:t,factory:t.\u0275fac})}return t})();var $e=(()=>{class t extends ae{autoResize;pSize;variant=M();fluid=M(void 0,{transform:b});invalid=M(void 0,{transform:b});$variant=Y(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new y;ngModelSubscription;ngControlSubscription;_componentStyle=h(le);ngControl=h(re,{optional:!0,self:!0});pcFluid=h(ie,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}ngOnInit(){super.ngOnInit(),this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState()}))}ngAfterViewInit(){super.ngAfterViewInit(),this.autoResize&&this.resize(),this.cd.detectChanges()}ngAfterViewChecked(){this.autoResize&&this.resize()}onInput(e){this.writeModelValue(e.target.value),this.updateState()}resize(e){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(e||{})}updateState(){this.autoResize&&this.resize()}ngOnDestroy(){this.ngModelSubscription&&this.ngModelSubscription.unsubscribe(),this.ngControlSubscription&&this.ngControlSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=_(t)))(i||t)}})();static \u0275dir=O({type:t,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(n,i){n&1&&g("input",function(f){return i.onInput(f)}),n&2&&s(i.cx("root"))},inputs:{autoResize:[2,"autoResize","autoResize",b],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[z([le]),T]})}return t})(),Le=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=k({type:t});static \u0275inj=w({})}return t})();var se=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.font.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`;var ge=["removeicon"],fe=["*"];function he(t,c){if(t&1){let e=C();v(0,"img",4),g("error",function(i){d(e);let o=r();return p(o.imageError(i))}),x()}if(t&2){let e=r();s(e.cx("image")),a("src",e.image,B)("alt",e.alt)}}function _e(t,c){if(t&1&&H(0,"span",6),t&2){let e=r(2);s(e.icon),a("ngClass",e.cx("icon")),m("data-pc-section","icon")}}function ve(t,c){if(t&1&&u(0,_e,1,4,"span",5),t&2){let e=r();a("ngIf",e.icon)}}function xe(t,c){if(t&1&&(v(0,"div"),q(1),x()),t&2){let e=r();s(e.cx("label")),m("data-pc-section","label"),l(),G(e.label)}}function be(t,c){if(t&1){let e=C();v(0,"span",10),g("click",function(i){d(e);let o=r(3);return p(o.close(i))})("keydown",function(i){d(e);let o=r(3);return p(o.onKeydown(i))}),x()}if(t&2){let e=r(3);s(e.removeIcon),a("ngClass",e.cx("removeIcon")),m("data-pc-section","removeicon")("aria-label",e.removeAriaLabel)}}function ye(t,c){if(t&1){let e=C();j(),v(0,"svg",11),g("click",function(i){d(e);let o=r(3);return p(o.close(i))})("keydown",function(i){d(e);let o=r(3);return p(o.onKeydown(i))}),x()}if(t&2){let e=r(3);s(e.cx("removeIcon")),m("data-pc-section","removeicon")("aria-label",e.removeAriaLabel)}}function Ce(t,c){if(t&1&&(V(0),u(1,be,1,5,"span",8)(2,ye,1,4,"svg",9),F()),t&2){let e=r(2);l(),a("ngIf",e.removeIcon),l(),a("ngIf",!e.removeIcon)}}function Ie(t,c){}function we(t,c){t&1&&u(0,Ie,0,0,"ng-template")}function ke(t,c){if(t&1){let e=C();v(0,"span",12),g("click",function(i){d(e);let o=r(2);return p(o.close(i))})("keydown",function(i){d(e);let o=r(2);return p(o.onKeydown(i))}),u(1,we,1,0,null,13),x()}if(t&2){let e=r(2);s(e.cx("removeIcon")),m("data-pc-section","removeicon")("aria-label",e.removeAriaLabel),l(),a("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function Te(t,c){if(t&1&&(V(0),u(1,Ce,3,2,"ng-container",3)(2,ke,2,5,"span",7),F()),t&2){let e=r();l(),a("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),l(),a("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var ze={root:()=>["p-chip p-component"],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},de=(()=>{class t extends S{name="chip";theme=se;classes=ze;static \u0275fac=(()=>{let e;return function(i){return(e||(e=_(t)))(i||t)}})();static \u0275prov=I({token:t,factory:t.\u0275fac})}return t})();var Me=(()=>{class t extends ne{label;icon;image;alt;styleClass;removable=!1;removeIcon;onRemove=new y;onImageError=new y;visible=!0;get removeAriaLabel(){return this.config.getTranslation(te.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([n,i])=>this[`_${n}`]!==i&&(this[`_${n}`]=i))}_chipProps;_componentStyle=h(de);removeIconTemplate;templates;_removeIconTemplate;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"removeicon":this._removeIconTemplate=e.template;break;default:this._removeIconTemplate=e.template;break}})}ngOnChanges(e){if(super.ngOnChanges(e),e.chipProps&&e.chipProps.currentValue){let{currentValue:n}=e.chipProps;n.label!==void 0&&(this.label=n.label),n.icon!==void 0&&(this.icon=n.icon),n.image!==void 0&&(this.image=n.image),n.alt!==void 0&&(this.alt=n.alt),n.styleClass!==void 0&&(this.styleClass=n.styleClass),n.removable!==void 0&&(this.removable=n.removable),n.removeIcon!==void 0&&(this.removeIcon=n.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}static \u0275fac=(()=>{let e;return function(i){return(e||(e=_(t)))(i||t)}})();static \u0275cmp=N({type:t,selectors:[["p-chip"]],contentQueries:function(n,i,o){if(n&1&&(D(o,ge,4),D(o,ee,4)),n&2){let f;R(f=P())&&(i.removeIconTemplate=f.first),R(f=P())&&(i.templates=f)}},hostVars:7,hostBindings:function(n,i){n&2&&(m("data-pc-name","chip")("aria-label",i.label)("data-pc-section","root"),s(i.cn(i.cx("root"),i.styleClass)),K("display",!i.visible&&"none"))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",removable:[2,"removable","removable",b],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[z([de]),T,A],ngContentSelectors:fe,decls:6,vars:4,consts:[["iconTemplate",""],[3,"class","src","alt","error",4,"ngIf","ngIfElse"],[3,"class",4,"ngIf"],[4,"ngIf"],[3,"error","src","alt"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],["tabindex","0","role","button",3,"class","click","keydown",4,"ngIf"],["tabindex","0","role","button",3,"class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","tabindex","0","role","button",3,"class","click","keydown",4,"ngIf"],["tabindex","0","role","button",3,"click","keydown","ngClass"],["data-p-icon","times-circle","tabindex","0","role","button",3,"click","keydown"],["tabindex","0","role","button",3,"click","keydown"],[4,"ngTemplateOutlet"]],template:function(n,i){if(n&1&&($(),L(0),u(1,he,1,4,"img",1)(2,ve,1,1,"ng-template",null,0,U)(4,xe,2,4,"div",2)(5,Te,3,2,"ng-container",3)),n&2){let o=Q(3);l(),a("ngIf",i.image)("ngIfElse",o),l(3),a("ngIf",i.label),l(),a("ngIf",i.removable)}},dependencies:[Z,J,W,X,oe,E],encapsulation:2,changeDetection:0})}return t})(),st=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=k({type:t});static \u0275inj=w({imports:[Me,E,E]})}return t})();export{$e as a,Le as b,Me as c,st as d};
