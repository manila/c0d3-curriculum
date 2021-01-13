const selectionArea = document.querySelector(".selection-area")

let mouseDown = false;
const cells = []

const selection = {
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0
}

const Cell = function () {
	this.element = document.createElement("div")
	this.element.classList.add("cell")
	this.x1 = 0
	this.y1 = 0
	this.x2 = 0
	this.y2 = 0
	
	this.select = () => {
		this.element.classList.add("selected")
	}

	this.unselect = () => {
		this.element.classList.remove("selected")
	}

	this.selected = () => {
		const { 
			offsetLeft, 
			offsetTop, 
			offsetWidth, 
			offsetHeight 
		} = selectionArea

		return (
			this.x1 < offsetLeft + offsetWidth &&
		    	this.x2 > offsetLeft &&
		    	this.y1 < offsetTop + offsetHeight &&
		    	this.y2 > offsetTop
		)
	}
}

const drawSelection = (x1, y1, x2, y2) => {
	const x = Math.min(x1, x2)
	const y = Math.min(y1, y2)
	const width = Math.max(x1, x2) - x
	const height = Math.max(y1, y2) - y

	selectionArea.style.display = "block"
	selectionArea.style.left = x + "px"
	selectionArea.style.top = y + "px"
	selectionArea.style.width = width + "px"
	selectionArea.style.height = height + "px"
}

document.onmousedown = (event) => {
	selection.x1 = event.offsetX
	selection.y1 = event.offsetY

	cells.forEach((cell) => cell.unselect())
	
	mouseDown = true
}

document.onmouseup = () => {
	selectionArea.style.display = "none"
	mouseDown = false
}

document.onmousemove = (event) => {
	selection.x2 = event.offsetX
	selection.y2 = event.offsetY

	const { x1, y1, x2, y2 } = selection

	if (mouseDown) {
		drawSelection(x1, y1, x2, y2)
		
		cells.forEach((cell) => {
			cell.selected() ? cell.select() : cell.unselect()
		})
	}
}

const setup = () => {
	for (let i = 0; i < 5 * 4; i++) {
		let cell = new Cell()

		cells.push(cell)
		document.querySelector(".grid").appendChild(cell.element)
		cell.x1 = cell.element.offsetLeft
		cell.y1 = cell.element.offsetTop
		cell.x2 = cell.x1 + cell.element.offsetWidth
		cell.y2 = cell.y1 + cell.element.offsetHeight
	}
}

setup()
