import{s as ee}from"./chunk-M772ALOX.js";import{Na as W,Oa as x,Pa as X,Va as Y,Ya as Z,f as G,h as H,l as U,p as J}from"./chunk-4QJ5GKRY.js";import{Aa as b,Dc as q,Eb as c,Fb as g,Gb as h,Hb as A,Lb as C,Mb as I,Ob as f,Sb as u,Ub as r,Uc as $,Va as D,Vb as O,Wb as R,Xb as w,Za as s,Zb as T,_b as k,bc as B,ca as V,cc as N,da as E,fc as m,gc as Q,ha as M,hc as K,ib as F,jb as j,ma as p,mb as z,na as l,oa as P,ob as _,pc as L,qb as y,yb as d,za as S}from"./chunk-UFNSFZ2P.js";var ne=`
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
`;var ie=["removeicon"],oe=["*"];function re(n,a){if(n&1){let e=f();g(0,"img",4),u("error",function(i){p(e);let o=r();return l(o.imageError(i))}),h()}if(n&2){let e=r();m(e.cx("image")),c("src",e.image,D)("alt",e.alt)}}function ce(n,a){if(n&1&&A(0,"span",6),n&2){let e=r(2);m(e.icon),c("ngClass",e.cx("icon")),d("data-pc-section","icon")}}function ae(n,a){if(n&1&&_(0,ce,1,4,"span",5),n&2){let e=r();c("ngIf",e.icon)}}function se(n,a){if(n&1&&(g(0,"div"),Q(1),h()),n&2){let e=r();m(e.cx("label")),d("data-pc-section","label"),s(),K(e.label)}}function pe(n,a){if(n&1){let e=f();g(0,"span",10),u("click",function(i){p(e);let o=r(3);return l(o.close(i))})("keydown",function(i){p(e);let o=r(3);return l(o.onKeydown(i))}),h()}if(n&2){let e=r(3);m(e.removeIcon),c("ngClass",e.cx("removeIcon")),d("data-pc-section","removeicon")("aria-label",e.removeAriaLabel)}}function le(n,a){if(n&1){let e=f();P(),g(0,"svg",11),u("click",function(i){p(e);let o=r(3);return l(o.close(i))})("keydown",function(i){p(e);let o=r(3);return l(o.onKeydown(i))}),h()}if(n&2){let e=r(3);m(e.cx("removeIcon")),d("data-pc-section","removeicon")("aria-label",e.removeAriaLabel)}}function me(n,a){if(n&1&&(C(0),_(1,pe,1,5,"span",8)(2,le,1,4,"svg",9),I()),n&2){let e=r(2);s(),c("ngIf",e.removeIcon),s(),c("ngIf",!e.removeIcon)}}function _e(n,a){}function de(n,a){n&1&&_(0,_e,0,0,"ng-template")}function ge(n,a){if(n&1){let e=f();g(0,"span",12),u("click",function(i){p(e);let o=r(2);return l(o.close(i))})("keydown",function(i){p(e);let o=r(2);return l(o.onKeydown(i))}),_(1,de,1,0,null,13),h()}if(n&2){let e=r(2);m(e.cx("removeIcon")),d("data-pc-section","removeicon")("aria-label",e.removeAriaLabel),s(),c("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function he(n,a){if(n&1&&(C(0),_(1,me,3,2,"ng-container",3)(2,ge,2,5,"span",7),I()),n&2){let e=r();s(),c("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),s(),c("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var fe={root:()=>["p-chip p-component"],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},te=(()=>{class n extends Y{name="chip";theme=ne;classes=fe;static \u0275fac=(()=>{let e;return function(i){return(e||(e=b(n)))(i||n)}})();static \u0275prov=V({token:n,factory:n.\u0275fac})}return n})();var ue=(()=>{class n extends Z{label;icon;image;alt;styleClass;removable=!1;removeIcon;onRemove=new y;onImageError=new y;visible=!0;get removeAriaLabel(){return this.config.getTranslation(X.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([t,i])=>this[`_${t}`]!==i&&(this[`_${t}`]=i))}_chipProps;_componentStyle=M(te);removeIconTemplate;templates;_removeIconTemplate;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"removeicon":this._removeIconTemplate=e.template;break;default:this._removeIconTemplate=e.template;break}})}ngOnChanges(e){if(super.ngOnChanges(e),e.chipProps&&e.chipProps.currentValue){let{currentValue:t}=e.chipProps;t.label!==void 0&&(this.label=t.label),t.icon!==void 0&&(this.icon=t.icon),t.image!==void 0&&(this.image=t.image),t.alt!==void 0&&(this.alt=t.alt),t.styleClass!==void 0&&(this.styleClass=t.styleClass),t.removable!==void 0&&(this.removable=t.removable),t.removeIcon!==void 0&&(this.removeIcon=t.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}static \u0275fac=(()=>{let e;return function(i){return(e||(e=b(n)))(i||n)}})();static \u0275cmp=F({type:n,selectors:[["p-chip"]],contentQueries:function(t,i,o){if(t&1&&(w(o,ie,4),w(o,W,4)),t&2){let v;T(v=k())&&(i.removeIconTemplate=v.first),T(v=k())&&(i.templates=v)}},hostVars:7,hostBindings:function(t,i){t&2&&(d("data-pc-name","chip")("aria-label",i.label)("data-pc-section","root"),m(i.cn(i.cx("root"),i.styleClass)),N("display",!i.visible&&"none"))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",removable:[2,"removable","removable",$],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[L([te]),z,S],ngContentSelectors:oe,decls:6,vars:4,consts:[["iconTemplate",""],[3,"class","src","alt","error",4,"ngIf","ngIfElse"],[3,"class",4,"ngIf"],[4,"ngIf"],[3,"error","src","alt"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],["tabindex","0","role","button",3,"class","click","keydown",4,"ngIf"],["tabindex","0","role","button",3,"class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","tabindex","0","role","button",3,"class","click","keydown",4,"ngIf"],["tabindex","0","role","button",3,"click","keydown","ngClass"],["data-p-icon","times-circle","tabindex","0","role","button",3,"click","keydown"],["tabindex","0","role","button",3,"click","keydown"],[4,"ngTemplateOutlet"]],template:function(t,i){if(t&1&&(O(),R(0),_(1,re,1,4,"img",1)(2,ae,1,1,"ng-template",null,0,q)(4,se,2,4,"div",2)(5,he,3,2,"ng-container",3)),t&2){let o=B(3);s(),c("ngIf",i.image)("ngIfElse",o),s(3),c("ngIf",i.label),s(),c("ngIf",i.removable)}},dependencies:[J,G,H,U,ee,x],encapsulation:2,changeDetection:0})}return n})(),Oe=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=j({type:n});static \u0275inj=E({imports:[ue,x,x]})}return n})();export{ue as a,Oe as b};
