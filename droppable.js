(() => {
	let dragentercount = 0;
	let currentdrag = null;

	// setup classes
	function highlight( dataTransfer = null ) {
		let flavors = [];

		if( dataTransfer ) {
			let text = false;
			let file = false;

			for( let i=0; i<dataTransfer.items.length; i++ ) {
				text |= dataTransfer.items[i].type === "text/plain";
				file |= dataTransfer.items[i].kind === "file";
			}

			if( text )
				flavors.push('text');

			if( file )
				flavors.push('file');
		}

		if( currentdrag )
			flavors.push( currentdrag.getAttribute('flavor') );

		document.querySelectorAll('[droppable][flavor]').forEach( i => {
			if( flavors.includes( i.getAttribute('flavor') ) )
				i.classList.add('droppable');
			else
				i.classList.remove('droppable');
		});

		document.querySelectorAll('[draggable][flavor]').forEach( i => {
			if( currentdrag === i )
				i.classList.add('dragging');
			else
				i.classList.remove('dragging');
		});

	}

	On( "dragstart", "[draggable][flavor]", function( evt ) {
		dragentercount = 0;
		currentdrag = this;
		highlight();

		if( this !== evt.target ) {
			let rect1 = this.getBoundingClientRect();
			let rect2 = evt.target.getBoundingClientRect();
			evt.dataTransfer.setDragImage( this, rect2.left-rect1.left+evt.offsetX, rect2.top-rect1.top+evt.offsetY );
		}
	});

	On( "dragend", "[draggable][flavor]", function( evt ) {
		dragentercount = 0;
		currentdrag = null;
		highlight();
	});

	On( "dragenter", document, function( evt ) {
		if( !(dragentercount++) )
			highlight( evt.dataTransfer );
	});

	On( "dragover", "[droppable][flavor]", function( evt ) {
		let flavor = this.getAttribute('flavor');

		let ok = currentdrag && currentdrag.getAttribute('flavor') === flavor;

		for( let i=0; i<evt.dataTransfer.items.length && !ok; i++ ) {
			ok |= evt.dataTransfer.items[i].type === "text/plain" && flavor === "text";
			ok |= evt.dataTransfer.items[i].kind === "file" && flavor === "file";
		}

		if( ok )
			evt.preventDefault();
	});

	On( "dragleave", document, function( evt ) {
		if( !(--dragentercount) )
			highlight();
	});

	On( "drop", "[droppable][flavor]", function( evt ) {
		let flavor = this.getAttribute('flavor');
		let event = new Event('dropcomplete', {bubbles:true} );

		if( currentdrag ) {
			// from flavored draggable to flavored droppable
			event.data = currentdrag;
		} else if( flavor==="file" && evt.dataTransfer.files.length ) {
			// from file drag to file flavored droppable, data is a FileList
			event.data = evt.dataTransfer.files
		} else if( flavor==="text" && evt.dataTransfer.getData('text/plain' ) ) {
			// from text drag to text flavored droppable, data is the text
			event.data = evt.dataTransfer.getData('text/plain' );
		}

		// Dispatch event
		this.dispatchEvent(event);

		// Reset styles
		currentdrag = null;
		dragentercount = 0;
		highlight();

		// Accept drop
		evt.preventDefault();
	});
})();