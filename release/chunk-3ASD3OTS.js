import{Oa as c,Va as R,eb as q,f as V,h as k,p as N}from"./chunk-ASVK72R6.js";import{Aa as g,Dc as x,Eb as i,Fb as v,Gb as f,Hb as T,Ob as B,Sb as D,Ub as r,Va as I,Vb as F,Wb as L,Za as d,bc as u,ca as h,da as _,fc as s,gc as j,ha as b,hc as A,ib as C,jb as w,ma as y,mb as E,na as z,ob as l,pc as S,qb as M,yb as m}from"./chunk-UFNSFZ2P.js";var H=`
    .p-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: dt('avatar.width');
        height: dt('avatar.height');
        font-size: dt('avatar.font.size');
        background: dt('avatar.background');
        color: dt('avatar.color');
        border-radius: dt('avatar.border.radius');
    }

    .p-avatar-image {
        background: transparent;
    }

    .p-avatar-circle {
        border-radius: 50%;
    }

    .p-avatar-circle img {
        border-radius: 50%;
    }

    .p-avatar-icon {
        font-size: dt('avatar.icon.size');
        width: dt('avatar.icon.size');
        height: dt('avatar.icon.size');
    }

    .p-avatar img {
        width: 100%;
        height: 100%;
    }

    .p-avatar-lg {
        width: dt('avatar.lg.width');
        height: dt('avatar.lg.width');
        font-size: dt('avatar.lg.font.size');
    }

    .p-avatar-lg .p-avatar-icon {
        font-size: dt('avatar.lg.icon.size');
        width: dt('avatar.lg.icon.size');
        height: dt('avatar.lg.icon.size');
    }

    .p-avatar-xl {
        width: dt('avatar.xl.width');
        height: dt('avatar.xl.width');
        font-size: dt('avatar.xl.font.size');
    }

    .p-avatar-xl .p-avatar-icon {
        font-size: dt('avatar.xl.icon.size');
        width: dt('avatar.xl.icon.size');
        height: dt('avatar.xl.icon.size');
    }

    .p-avatar-group {
        display: flex;
        align-items: center;
    }

    .p-avatar-group .p-avatar + .p-avatar {
        margin-inline-start: dt('avatar.group.offset');
    }

    .p-avatar-group .p-avatar {
        border: 2px solid dt('avatar.group.border.color');
    }

    .p-avatar-group .p-avatar-lg + .p-avatar-lg {
        margin-inline-start: dt('avatar.lg.group.offset');
    }

    .p-avatar-group .p-avatar-xl + .p-avatar-xl {
        margin-inline-start: dt('avatar.xl.group.offset');
    }
`;var P=["*"];function U(a,o){if(a&1&&(v(0,"span"),j(1),f()),a&2){let t=r();s(t.cx("label")),d(),A(t.label)}}function G(a,o){if(a&1&&T(0,"span",4),a&2){let t=r(2);s(t.icon),i("ngClass",t.cx("icon"))}}function J(a,o){if(a&1&&l(0,G,1,3,"span",3),a&2){let t=r(),n=u(5);i("ngIf",t.icon)("ngIfElse",n)}}function K(a,o){if(a&1){let t=B();v(0,"img",6),D("error",function(e){y(t);let p=r(2);return z(p.imageError(e))}),f()}if(a&2){let t=r(2);i("src",t.image,I),m("aria-label",t.ariaLabel)}}function Q(a,o){if(a&1&&l(0,K,1,2,"img",5),a&2){let t=r();i("ngIf",t.image)}}var W={root:({instance:a})=>["p-avatar p-component",{"p-avatar-image":a.image!=null,"p-avatar-circle":a.shape==="circle","p-avatar-lg":a.size==="large","p-avatar-xl":a.size==="xlarge"}],label:"p-avatar-label",icon:"p-avatar-icon"},O=(()=>{class a extends R{name="avatar";theme=H;classes=W;static \u0275fac=(()=>{let t;return function(e){return(t||(t=g(a)))(e||a)}})();static \u0275prov=h({token:a,factory:a.\u0275fac})}return a})();var X=(()=>{class a extends q{label;icon;image;size="normal";shape="square";styleClass;ariaLabel;ariaLabelledBy;onImageError=new M;_componentStyle=b(O);imageError(t){this.onImageError.emit(t)}static \u0275fac=(()=>{let t;return function(e){return(t||(t=g(a)))(e||a)}})();static \u0275cmp=C({type:a,selectors:[["p-avatar"]],hostVars:5,hostBindings:function(n,e){n&2&&(m("data-pc-name","avatar")("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy),s(e.cn(e.cx("root"),e.styleClass)))},inputs:{label:"label",icon:"icon",image:"image",size:"size",shape:"shape",styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onImageError:"onImageError"},features:[S([O]),E],ngContentSelectors:P,decls:6,vars:2,consts:[["iconTemplate",""],["imageTemplate",""],[3,"class",4,"ngIf","ngIfElse"],[3,"class","ngClass",4,"ngIf","ngIfElse"],[3,"ngClass"],[3,"src","error",4,"ngIf"],[3,"error","src"]],template:function(n,e){if(n&1&&(F(),L(0),l(1,U,2,3,"span",2)(2,J,1,2,"ng-template",null,0,x)(4,Q,1,1,"ng-template",null,1,x)),n&2){let p=u(3);d(),i("ngIf",e.label)("ngIfElse",p)}},dependencies:[N,V,k,c],encapsulation:2,changeDetection:0})}return a})(),ma=(()=>{class a{static \u0275fac=function(n){return new(n||a)};static \u0275mod=w({type:a});static \u0275inj=_({imports:[X,c,c]})}return a})();export{X as a,ma as b};
