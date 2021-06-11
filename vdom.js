
vdom = {
	stringToHTML: function (str) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(str, 'text/html');
		return doc.body;
	},
	getNodeType: function (node) {
		if (node.nodeType === 3) return 'text';
		if (node.nodeType === 8) return 'comment';
		return node.tagName.toLowerCase();
	},
	getNodeContent: function (node) {
		if (node.childNodes && node.childNodes.length > 0) return null;
		return node.textContent;
	},
	diff: function(template, elem){
		var domNodes = Array.prototype.slice.call(elem.childNodes);
		var templateNodes = Array.prototype.slice.call(template.childNodes);
		var count = domNodes.length - templateNodes.length;
		if (count > 0) {
			for (; count > 0; count--) {
				domNodes[domNodes.length - count].parentNode.removeChild(domNodes[domNodes.length - count]);
			}
		}
		templateNodes.forEach(function (node, index) {
			if (!domNodes[index]) {
				elem.appendChild(node.cloneNode(true));
				return;
			}
			if (vdom.getNodeType(node) !== vdom.getNodeType(domNodes[index])) {
				domNodes[index].parentNode.replaceChild(node.cloneNode(true), domNodes[index]);
				return;
			}
			var templateContent = vdom.getNodeContent(node);
			if (templateContent && templateContent !== vdom.getNodeContent(domNodes[index])) {
				domNodes[index].textContent = templateContent;
			}
			if (domNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
				domNodes[index].innerHTML = '';
				return;
			}
			if (domNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
				var fragment = document.createDocumentFragment();
				vdom.diff(node, fragment);
				domNodes[index].appendChild(fragment);
				return;
			}
			if (node.childNodes.length > 0) {
				vdom.diff(node, domNodes[index]);
			}
		});
	},
	render: function(dom, value){
		var templateHTML = vdom.stringToHTML( value );
		var aux = document.querySelector(dom);
		aux.style.display='none';
		vdom.diff(templateHTML, aux );
		$(dom).fadeIn(400);
	}
}