let cells = []

const GAME_SIZE = 10
const MINE_COUNT = 10

const minefield = document.querySelector(".minefield")

const neighbors = [
	{ x: -1, y: -1 },
	{ x: 0, y: -1 },
	{ x: 1, y: -1 },
	{ x: -1, y: 0 },
	{ x: 1, y: 0 },
	{ x: -1, y: 1 },
	{ x: 0, y: 1 },
	{ x: 1, y: 1 }
]

const Cell = function (index) {
	this.count = 0
	this.index = index
	this.revealed = false
	this.isMine = false
	this.flagged = false
	this.element = document.createElement("div")

	this.element.classList.add("cell")

	this.element.onclick = () => {
		if (this.isMine) {
			this.reveal()
			gameOver()
		} else {
			revealCell(this.index)
			checkWin()
		}
	}

	this.element.oncontextmenu = (e) => {
		e.preventDefault()
		this.flagged ? this.unflag() : this.flag()
	}

	this.reveal = () => {
		this.unflag()
		this.revealed = true
		this.element.classList.add("revealed")
		this.element.innerHTML = this.count > 0 ? this.count : ''
		this.isMine ? this.element.innerHTML = 'B' : false
	}

	this.flag = () => {
		if (!this.revealed) {
			this.flagged = true
			this.element.classList.add("flag")
		}
	}

	this.unflag = () => {
		this.flagged = false
		this.element.classList.remove("flag")
	}
}

const index = (row, col) => {
	return (row * GAME_SIZE) + col
}

const inBounds = (row, col) => {
	return (row < GAME_SIZE && row >= 0 && col < GAME_SIZE && col >= 0)
}


const revealCell = (idx) => {
	const row = Math.floor(idx / GAME_SIZE)
	const col = idx % GAME_SIZE 

	if (!cells[idx] || cells[idx].revealed || cells[idx].isMine) {
		return false
	}

	cells[idx].reveal()

	if (cells[idx].count == 0) {
		neighbors.forEach(({x, y}) => {
			inBounds(row + y, col + x) && revealCell(index(row + y, col + x))
		})
	}
}

const updateCounts = (row, col) => {
	neighbors.forEach(({x, y}) => {
		inBounds(row + y, col + x) && cells[index(row + y, col + x)].count++
	})
}

const placeMines = (count = 0) => {
	const row = Math.floor(Math.random() * GAME_SIZE)
	const col = Math.floor(Math.random() * GAME_SIZE)

	if (count == 0) {
		return false
	}

	if (cells[index(row, col)].isMine) {
		return placeMines(count)
	}

	cells[index(row, col)].isMine = true
	updateCounts(row, col)
	
	return placeMines(count - 1)
}

const checkWin = () => {
	const revealCount = cells.reduce((acc, cell) => {
		if (cell.revealed) { 
			return acc + 1
		}
		return acc
	}, 0)

	if (revealCount == GAME_SIZE * GAME_SIZE - MINE_COUNT) {
		gameWin(true)
	}
}

const gameWin = () => {
	confirm("You Win! Play Again?") && setup()
}

const gameOver = () => {
	confirm("You Lose. Play Again?") && setup()
}

const setup = () => {
	cells = []
	minefield.innerHTML = ''
	for (let i = 0; i < GAME_SIZE * GAME_SIZE; i++) {
		const cell = new Cell(i)
		minefield.appendChild(cell.element)
		cells.push(cell)
	}
	placeMines(MINE_COUNT)
}

setup()
