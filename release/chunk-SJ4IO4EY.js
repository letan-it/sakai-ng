import{C as se,I as le,Ka as me,N as ce,Na as fe,Oa as d,Ra as he,U as pe,Va as F,Ya as B,ab as ve,ca as K,db as H,f as ne,h as E,ia as de,ja as ue,k as oe,l as re,p as P,q as V}from"./chunk-4QJ5GKRY.js";import{$c as q,Aa as h,Dc as Y,Eb as s,Fb as g,Gb as C,Hb as G,Ob as S,Sb as b,Ub as r,Uc as O,Va as U,Vb as L,Vc as ie,Wb as z,Xb as R,Ya as $,Za as v,Zb as j,_b as Z,_c as ae,bc as N,bd as M,ca as x,cd as A,da as w,dd as W,fc as u,gc as J,ha as f,hc as ee,ib as k,jb as T,ma as l,mb as I,na as c,ob as p,pc as D,qb as y,rb as X,rc as te,sc as Q,yb as _}from"./chunk-UFNSFZ2P.js";var xe=["content"],we=["*"],ke=(t,a)=>({showTransitionParams:t,hideTransitionParams:a}),Te=(t,a)=>({value:t,params:a}),Ie=t=>({closeCallback:t});function Se(t,a){}function Le(t,a){t&1&&p(0,Se,0,0,"ng-template")}function ze(t,a){if(t&1){let e=S();g(0,"div",1),b("click",function(n){l(e);let o=r();return c(o.onOverlayClick(n))})("@animation.start",function(n){l(e);let o=r();return c(o.onAnimationStart(n))})("@animation.done",function(n){l(e);let o=r();return c(o.onAnimationEnd(n))}),g(1,"div",2),b("click",function(n){l(e);let o=r();return c(o.onContentClick(n))})("mousedown",function(n){l(e);let o=r();return c(o.onContentClick(n))}),z(2),p(3,Le,1,0,null,3),C()()}if(t&2){let e=r();u(e.cn(e.cx("root"),e.styleClass)),s("ngStyle",e.style)("@animation",Q(14,Te,e.overlayVisible?"open":"close",Q(11,ke,e.showTransitionOptions,e.hideTransitionOptions))),_("aria-modal",e.overlayVisible)("aria-label",e.ariaLabel)("aria-labelledBy",e.ariaLabelledBy),v(),u(e.cx("content")),v(2),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",te(17,Ie,e.onCloseClick.bind(e)))}}var De=`
.p-popover {
    margin-top: dt('popover.gutter');
    background: dt('popover.background');
    color: dt('popover.color');
    border: 1px solid dt('popover.border.color');
    border-radius: dt('popover.border.radius');
    box-shadow: dt('popover.shadow');
    position: absolute
}

.p-popover-content {
    padding: dt('popover.content.padding');
}

.p-popover-flipped {
    margin-top: calc(dt('popover.gutter') * -1);
    margin-bottom: dt('popover.gutter');
}

.p-popover-enter-from {
    opacity: 0;
    transform: scaleY(0.8);
}

.p-popover-leave-to {
    opacity: 0;
}

.p-popover-enter-active {
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1), opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-popover-leave-active {
    transition: opacity 0.1s linear;
}

.p-popover:after,
.p-popover:before {
    bottom: 100%;
    left: calc(dt('popover.arrow.offset') + dt('popover.arrow.left'));
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.p-popover:after {
    border-width: calc(dt('popover.gutter') - 2px);
    margin-left: calc(-1 * (dt('popover.gutter') - 2px));
    border-style: solid;
    border-color: transparent;
    border-bottom-color: dt('popover.background');
}

.p-popover:before {
    border-width: dt('popover.gutter');
    margin-left: calc(-1 * dt('popover.gutter'));
    border-style: solid;
    border-color: transparent;
    border-bottom-color: dt('popover.border.color');
}

.p-popover-flipped:after,
.p-popover-flipped:before {
    bottom: auto;
    top: 100%;
}

.p-popover.p-popover-flipped:after {
    border-bottom-color: transparent;
    border-top-color: dt('popover.background');
}

.p-popover.p-popover-flipped:before {
    border-bottom-color: transparent;
    border-top-color: dt('popover.border.color');
}

`,Oe={root:"p-popover p-component",content:"p-popover-content"},ge=(()=>{class t extends F{name="popover";theme=De;classes=Oe;static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275prov=x({token:t,factory:t.\u0275fac})}return t})(),Ee=(()=>{class t extends B{ariaLabel;ariaLabelledBy;dismissable=!0;style;styleClass;appendTo="body";autoZIndex=!0;ariaCloseLabel;baseZIndex=0;focusOnShow=!0;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";onShow=new y;onHide=new y;container;overlayVisible=!1;render=!1;isOverlayAnimationInProgress=!1;selfClick=!1;documentClickListener;target;willHide;scrollHandler;documentResizeListener;contentTemplate;templates;_contentTemplate;destroyCallback;overlayEventListener;overlaySubscription;_componentStyle=f(ge);zone=f(X);overlayService=f(me);ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break}})}bindDocumentClickListener(){if(V(this.platformId)&&!this.documentClickListener){let e=de()?"touchstart":"click",i=this.el?this.el.nativeElement.ownerDocument:this.document;this.documentClickListener=this.renderer.listen(i,e,n=>{this.dismissable&&(!this.container?.contains(n.target)&&this.target!==n.target&&!this.target.contains(n.target)&&!this.selfClick&&this.hide(),this.selfClick=!1,this.cd.markForCheck())})}}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null,this.selfClick=!1)}toggle(e,i){this.isOverlayAnimationInProgress||(this.overlayVisible?(this.hasTargetChanged(e,i)&&(this.destroyCallback=()=>{this.show(null,i||e.currentTarget||e.target)}),this.hide()):this.show(e,i))}show(e,i){i&&e&&e.stopPropagation(),!this.isOverlayAnimationInProgress&&(this.target=i||e.currentTarget||e.target,this.overlayVisible=!0,this.render=!0,this.cd.markForCheck())}onOverlayClick(e){this.overlayService.add({originalEvent:e,target:this.el.nativeElement}),this.selfClick=!0}onContentClick(e){let i=e.target;this.selfClick=e.offsetX<i.clientWidth&&e.offsetY<i.clientHeight}hasTargetChanged(e,i){return this.target!=null&&this.target!==(i||e.currentTarget||e.target)}appendContainer(){this.appendTo&&(this.appendTo==="body"?this.renderer.appendChild(this.document.body,this.container):ce(this.appendTo,this.container))}restoreAppend(){this.container&&this.appendTo&&this.renderer.appendChild(this.el.nativeElement,this.container)}align(){this.autoZIndex&&H.set("overlay",this.container,this.baseZIndex+this.config.zIndex.overlay),le(this.container,this.target,!1);let e=K(this.container),i=K(this.target),n=this.document.defaultView?.getComputedStyle(this.container).getPropertyValue("border-radius"),o=0;e.left<i.left&&(o=i.left-e.left-parseFloat(n)*2),this.container?.style.setProperty(he("popover.arrow.left").name,`${o}px`),e.top<i.top&&(this.container.setAttribute("data-p-popover-flipped","true"),se(this.container,"p-popover-flipped"))}onAnimationStart(e){e.toState==="open"&&(this.container=e.element,this.container?.setAttribute(this.attrSelector,""),this.appendContainer(),this.align(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindScrollListener(),this.focusOnShow&&this.focus(),this.overlayEventListener=i=>{this.container&&this.container.contains(i.target)&&(this.selfClick=!0)},this.overlaySubscription=this.overlayService.clickObservable.subscribe(this.overlayEventListener),this.onShow.emit(null)),this.isOverlayAnimationInProgress=!0}onAnimationEnd(e){switch(e.toState){case"void":this.destroyCallback&&(this.destroyCallback(),this.destroyCallback=null),this.overlaySubscription&&this.overlaySubscription.unsubscribe();break;case"close":this.autoZIndex&&H.clear(this.container),this.overlaySubscription&&this.overlaySubscription.unsubscribe(),this.onContainerDestroy(),this.onHide.emit({}),this.render=!1;break}this.isOverlayAnimationInProgress=!1}focus(){let e=pe(this.container,"[autofocus]");e&&this.zone.runOutsideAngular(()=>{setTimeout(()=>e.focus(),5)})}hide(){this.overlayVisible=!1,this.cd.markForCheck()}onCloseClick(e){this.hide(),e.preventDefault()}onEscapeKeydown(e){this.hide()}onWindowResize(){this.overlayVisible&&!ue()&&this.hide()}bindDocumentResizeListener(){if(V(this.platformId)&&!this.documentResizeListener){let e=this.document.defaultView;this.documentResizeListener=this.renderer.listen(e,"resize",this.onWindowResize.bind(this))}}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindScrollListener(){V(this.platformId)&&(this.scrollHandler||(this.scrollHandler=new ve(this.target,()=>{this.overlayVisible&&this.hide()})),this.scrollHandler.bindScrollListener())}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}onContainerDestroy(){this.cd.destroyed||(this.target=null),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindScrollListener()}ngOnDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.container&&this.autoZIndex&&H.clear(this.container),this.cd.destroyed||(this.target=null),this.destroyCallback=null,this.container&&(this.restoreAppend(),this.onContainerDestroy()),this.overlaySubscription&&this.overlaySubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275cmp=k({type:t,selectors:[["p-popover"]],contentQueries:function(i,n,o){if(i&1&&(R(o,xe,4),R(o,fe,4)),i&2){let m;j(m=Z())&&(n.contentTemplate=m.first),j(m=Z())&&(n.templates=m)}},hostBindings:function(i,n){i&1&&b("keydown.escape",function(m){return n.onEscapeKeydown(m)},$)},inputs:{ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",dismissable:[2,"dismissable","dismissable",O],style:"style",styleClass:"styleClass",appendTo:"appendTo",autoZIndex:[2,"autoZIndex","autoZIndex",O],ariaCloseLabel:"ariaCloseLabel",baseZIndex:[2,"baseZIndex","baseZIndex",ie],focusOnShow:[2,"focusOnShow","focusOnShow",O],showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions"},outputs:{onShow:"onShow",onHide:"onHide"},features:[D([ge]),I],ngContentSelectors:we,decls:1,vars:1,consts:[["role","dialog",3,"class","ngStyle","click",4,"ngIf"],["role","dialog",3,"click","ngStyle"],[3,"click","mousedown"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,n){i&1&&(L(),p(0,ze,4,19,"div",0)),i&2&&s("ngIf",n.render)},dependencies:[P,E,re,oe,d],encapsulation:2,data:{animation:[ae("animation",[A("void",M({transform:"scaleY(0.8)",opacity:0})),A("close",M({opacity:0})),A("open",M({transform:"translateY(0)",opacity:1})),W("void => open",q("{{showTransitionParams}}")),W("open => close",q("{{hideTransitionParams}}"))])]},changeDetection:0})}return t})(),st=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=T({type:t});static \u0275inj=w({imports:[Ee,d,d]})}return t})();var be=`
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
`;var Pe=["*"];function Ve(t,a){if(t&1&&(g(0,"span"),J(1),C()),t&2){let e=r();u(e.cx("label")),v(),ee(e.label)}}function Me(t,a){if(t&1&&G(0,"span",4),t&2){let e=r(2);u(e.icon),s("ngClass",e.cx("icon"))}}function Ae(t,a){if(t&1&&p(0,Me,1,3,"span",3),t&2){let e=r(),i=N(5);s("ngIf",e.icon)("ngIfElse",i)}}function Fe(t,a){if(t&1){let e=S();g(0,"img",6),b("error",function(n){l(e);let o=r(2);return c(o.imageError(n))}),C()}if(t&2){let e=r(2);s("src",e.image,U),_("aria-label",e.ariaLabel)}}function Be(t,a){if(t&1&&p(0,Fe,1,2,"img",5),t&2){let e=r();s("ngIf",e.image)}}var He={root:({instance:t})=>["p-avatar p-component",{"p-avatar-image":t.image!=null,"p-avatar-circle":t.shape==="circle","p-avatar-lg":t.size==="large","p-avatar-xl":t.size==="xlarge"}],label:"p-avatar-label",icon:"p-avatar-icon"},ye=(()=>{class t extends F{name="avatar";theme=be;classes=He;static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275prov=x({token:t,factory:t.\u0275fac})}return t})();var Re=(()=>{class t extends B{label;icon;image;size="normal";shape="square";styleClass;ariaLabel;ariaLabelledBy;onImageError=new y;_componentStyle=f(ye);imageError(e){this.onImageError.emit(e)}static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275cmp=k({type:t,selectors:[["p-avatar"]],hostVars:5,hostBindings:function(i,n){i&2&&(_("data-pc-name","avatar")("aria-label",n.ariaLabel)("aria-labelledby",n.ariaLabelledBy),u(n.cn(n.cx("root"),n.styleClass)))},inputs:{label:"label",icon:"icon",image:"image",size:"size",shape:"shape",styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onImageError:"onImageError"},features:[D([ye]),I],ngContentSelectors:Pe,decls:6,vars:2,consts:[["iconTemplate",""],["imageTemplate",""],[3,"class",4,"ngIf","ngIfElse"],[3,"class","ngClass",4,"ngIf","ngIfElse"],[3,"ngClass"],[3,"src","error",4,"ngIf"],[3,"error","src"]],template:function(i,n){if(i&1&&(L(),z(0),p(1,Ve,2,3,"span",2)(2,Ae,1,2,"ng-template",null,0,Y)(4,Be,1,1,"ng-template",null,1,Y)),i&2){let o=N(3);v(),s("ngIf",n.label)("ngIfElse",o)}},dependencies:[P,ne,E,d],encapsulation:2,changeDetection:0})}return t})(),wt=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=T({type:t});static \u0275inj=w({imports:[Re,d,d]})}return t})();export{Ee as a,st as b,Re as c,wt as d};
