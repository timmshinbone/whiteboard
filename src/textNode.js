import Konva from "konva";
const uuidv1 = require("uuid/v1");

export const addTextNode = (stage, layer) => {
	const id = uuidv1();
	const textNode = new Konva.Text({
		text: "type here",
		x: 50,
		y: 80,
		fontSize: 20,
		draggable: true,
		width: 200,
		id,
	});

	layer.add(textNode);

	let tr = new Konva.Transformer({
		node: textNode,
		enabledAnchors: ["middle-left", "middle-right"],
		//set minimum width of text
		boundBoxFunc: function(oldBox, newBox) {
			newBox.width = Math.max(30, newBox.width);
			return newBox;
		},
	});

	stage.on("click", function(e) {
		if(!this.clickStartShape) {
			return;
		}
		if (e.target._id === this.clickStartShape._id) {
			layer.add(tr);
			tr.attachTo(e.target);
			layer.draw();
		} else {
			tr.detach();
			layer.draw();
		}
	});

	textNode.on("transform", function() {
		//reset scale, so only width is changed by transformer
		textNode.setAttrs({
			width: textNode.width() * textNode.scaleX(),
			scaleX: 1,
		});
	});

	layer.add(tr);

	layer.draw();

	textNode.on("dblclick", () => {
		//hide text node and transformer:
		textNode.hide();
		tr.hide();
		layer.draw();

		//now to create textArea over Canvas with absolute position
		//do this by finding position for textarea
		//first will find the position of textNode relative to stage:
		let textPosition = textNode.absolutePosition();

		//then finding the position of stage container on page:
		let stageBox = stage.container().getBoundingClientRect();

		//position of the text area is the sum of the above to variables
		let areaPosition = {
			x: stageBox.left + textPosition.x,
			y: stageBox.top + textPosition.y,
		};

		//create and style the text area
		let textArea = document.createElement("textArea");
		document.body.appendChild(textArea);

		//the following applies many styles to match the text on canvas
		//text rendering on canvas and on the text area can be different
		//typically hard to make them 100% the same

		textArea.value = textNode.text();
		textArea.style.position = "absolute";
		textArea.style.top = areaPosition.y + "px";
		textArea.style.left = areaPosition.x + "px";
		textArea.style.width = textNode.width() - textNode.padding() * 2 + "px";
		textArea.style.height = textNode.height() - textNode.padding() * 2 + 5 + "px";
		textArea.style.fontSize = textNode.fontSize() + "px";
		textArea.style.border = "none";
		textArea.style.padding = "0px";
		textArea.style.margin = "0px";
		textArea.style.overflow = "hidden";
		textArea.style.background = "none";
		textArea.style.outline = "none";
		textArea.style.resize = "none";
		textArea.style.lineHeight = textNode.lineHeight();
		textArea.style.fontFamily = textNode.fontFamily();
		textArea.style.transformOrigin = "left top";
		textArea.style.textAlign = textNode.align();
		textArea.style.color = textNode.fill();
		let rotation = textNode.rotation();
		let transform = "";
		if(rotation) {
			transform += "rotateZ(" + rotation + "deg)";
		}

		let px = 0;
		let isFireFox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
		if(isFireFox) {
			px += 2 + Math.round(textNode.fontSize() / 20);
		}
		transform += "translateY(-" + px + "px)";

		textArea.style.transform = transform;
		textArea.style.height = "auto";
		//after browsers resized it, we can set the actual value
		textArea.style.height = textArea.scrollHeight + 3 + "px";

		textArea.focus();

		function removeTextArea() {
			textArea.parentNode.removeChild(textArea);
			window.removeEventListener("click", handleOutsideClick);
			textNode.show();
			tr.show();
			tr.forceUpdate();
			layer.draw();
		}

		function setTextAreaWidth(newWidth) {
			if(!newWidth){
				//set the width for the placeholder
				newWidth = textNode.placeholder.length * textNode.fontSize();
			}
			//extra fixes for different browsers
			let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			let isFireFox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

			if(isSafari || isFireFox) {
				newWidth = Math.ceil(newWidth);
			}
			let isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
			if(isEdge) {
				newWidth += 1;
			}
			textArea.style.width = newWidth + "px";
		}

		textArea.addEventListener("keydown", function(e) {
			//hide on enter
			//but dont hide on shift+enter
			if(e.keyCode === 13 && !e.shiftKey) {
				textNode.text(textArea.value);
				removeTextArea();
			}
			//on esc do not set value back to node
			if(e.keyCode === 27) {
				removeTextArea();
			};
		});

		textArea.addEventListener("keydown", function(e) {
			let scale = textNode.getAbsoluteScale().x;
			setTextAreaWidth(textNode.width() * scale);
			textArea.style.height = "auto";
			textArea.style.height = textArea.scrollHeight + textNode.fontSize() + "px";
		});

		function handleOutsideClick(e) {
			if (e.target !== textArea) {
				removeTextArea();
			}
		}
		setTimeout(() => {
			window.addEventListener("click", handleOutsideClick);
		});
	});
	return id
};











