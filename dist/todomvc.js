!function(t){function e(o){if(n[o])return n[o].exports;var c=n[o]={exports:{},id:o,loaded:!1};return t[o].call(c.exports,c,c.exports,e),c.loaded=!0,c.exports}var n={};return e.m=t,e.c=n,e.p="/assets/",e(0)}([/*!*************************************!*\
  !*** ./demo/todomvc/todomvc.coffee ***!
  \*************************************/
function(t,e){var n,o,c,r,i,u,d,l,a,f,s,p,m,h,g,v,b,w,x,k,N,y,C,O,S,$,M,T,j,A,I,J,z,D,E,L,P,V,W,q,B,F,G,H,K,Q;c=dc.bind,J=dc.section,b=dc.h1,w=dc.header,g=dc.form,L=dc.text,i=dc.checkbox,l=dc.div,H=dc.ul,k=dc.li,O=dc.p,n=dc.a,x=dc.label,r=dc.button,h=dc.footer,E=dc.strong,D=dc.span,a=dc.each,G=dc.txt,p=dc.extend,dc.directives({$show:dc.$show}),m=function(){return JSON.parse(localStorage.getItem("dc")||"[]")},A=function(t){return localStorage.setItem("dc",JSON.stringify(t))},B=[],Q=null,s=null,C=null,j=null,I=!1,v=function(){return"active"===Q?B.filter(function(t){return t&&!t.completed}):"completed"===Q?B.filter(function(t){return t&&t.completed}):B},$=function(){return B.filter(function(t){return!t.completed}).length},d=function(){return B.length-$()},o=function(){return!$()},y=function(t){return function(e){return 27===e.keyCode||27===e.which?t():void 0}},S=function(t,e){return G("function"==typeof t?function(){return t()>1?e+"s":e}:t>1?e+"s":e)},F=function(t){return t.completed=!t.completed,A(B),K.update()},N=function(){var t,e,n,c,r;for(t=o()?!1:!0,n=!0,c=0,r=B.length;r>c;c++)e=B[c],e.completed!==t&&(e.completed=t,n=!1);return n?void 0:(A(B),K.update())},f=function(t){return s=t,C=p({},t),K.update()},M=function(t){var e;return e=B.indexOf(t),B.splice(e,1),A(B),K.update()},T=function(t){return B[B.indexOf(t)]=C,K.update()},u=function(){var t,e;for(e=!0,t=B.length-1;t>=0;)B[t].completed&&(B.splice(t,1),e=!1),t--;return e?void 0:(A(B),K.update())},z=function(t){return Q=t.split("/")[1]||"",K.update()},W=w({id:"header"},b("todos"),g({id:"todo-form"},L({id:"new-todo",placeholder:"What needs to be done?",disable:function(){return I},onchange:function(){return this.value?(B.push({title:this.value,completed:!1}),A(B),K.update()):void 0},autofocus:!0}))),q=a(v,function(t,e){return k({className:{completed:function(){return t.completed},editing:function(){return t===s}}},l({"class":"view"},i({className:"toggle",checked:function(){return t&&t.completed},onchange:function(){return F(t)}}),x({ondblclick:function(){return f(t)}},function(){return t&&t.title}),r({className:"destroy",onclick:function(){return M(t)}})),g({submit:function(){return A(B)}},L({className:"edit",trim:"false",value:c(t,"title"),onblur:function(){return t.title=this.value,A(B),s=null,K.update()},onfocus:function(){return t===s},onkeyup:y(function(){return T(t)})})))}),P=J({id:"main"},i({id:"toggle-all",className:"toggle",checked:function(){return!!o()},onclick:N}),x({"for":"toggle-all"},"Mark all as complete"),H({id:"todo-list"},q),h({id:"footer",$show:function(){return B.length}},D({id:"todo-count"},E($),S($," item")," left"),H({id:"filters"},k(n({className:{selected:function(){return""===Q}},href:"#/all"},"All")),k(n({className:{selected:function(){return"active"===Q}},href:"#/active"},"Active")),k(n({className:{selected:function(){return"completed"===Q}},href:"#/completed"},"Completed"))),r({id:"clear-completed",onclick:u,$show:d},G(function(){return"Clear completed: "+d()})))),V=h({id:"info"},O("Double-click to edit a todo"),O("Created by ",n({href:"http://github.com/taijiweb/domcom"},"Caoxingming(Tiijizhenren, simeon.chaos@gmail.com)")),O("Part of ",n({href:"http://todomvc.com"}," TodoMVC"))),K=J({id:"todoapp"},W,P,V),window.runTodoMvc=function(){return B=m(),K.mount("#todo-app"),z(document.location.hash),window.addEventListener("hashchange",function(){return z(document.location.hash)})}}]);