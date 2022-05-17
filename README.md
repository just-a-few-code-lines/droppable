# droppable
Ease html drag &amp; drop by adding the 'flavor' and 'droppable' attributes.

    Add attributes 'droppable' and 'flavor' to html
 
    An element marked draggable="yes" and flavor="xxx" will become droppable on any other, marked droppable="yes" and flavor="xxx".
    Text drags comming from the outside world can be dropped on "text" flavored droppables
    File drags comming from the outside world can be dropped on "file" flavored droppables
 
    On drag & drop completion, the droppable element will receive the "dropcomplete" event, with the data field containing :
      - The source draggable element, if draggable data comes from a flavored draggable element
      - A string, if the droppable is text flavored and the dragged data is a plain text
      - A FileList, if the droppable is file flavord and the dragged data is a FileList
 
    Styles :
  	  - The class "dragging" is added on the draggable element during drag
      - The class "droppable" is added on any compatible droppable element during drag
