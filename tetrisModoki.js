(function () {
    'use strict';

    const container = document.querySelector('#container');
    const table = document.createElement('table');
    const rowCount = 22;
    const columnCount = 10;
    const startPosition = { x: 4, y: 0 };
    const roopInterval = 30;
    const moveInterval = 1000;
    const state = {
        fallingBlock: null,
        groundedCells: [],
        lastMovedTime: null
    };
    const blocks = [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
    ];
    let cells = []; // y, x order index ex. cells[y][x]

    function createTable() {
        for (let i = 0; i < rowCount; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < columnCount; j++) {
                const td = document.createElement('td');
                td.setAttribute('id', 'cell-' + j + '-' + i);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        container.appendChild(table);
    }

    function clearCells() {
        cells = [];
        for (let i = 0; i < rowCount; i++) {
            const row = [];
            for (let j = 0; j < columnCount; j++) {
                row.push(false);
            }
            cells.push(row);
        }
    }

    function mainLoop() {
        render();
        setTimeout(mainLoop, roopInterval);
    }

    function render() {
        clearCells();

        let block = null;
        if (!state.fallingBlock) {
            block = [];
            const originBlock = blocks[0]; // TODO get random
            // set starting position and copy
            for (let i = 0; i < originBlock.length; i++) {
                block.push({
                    x: (originBlock[i].x + startPosition.x),
                    y: (originBlock[i].y + startPosition.y)
                })
            }
            state.lastMovedTime = new Date().getTime();
        } else {

            const now = new Date();
            if (canMove(now)) {
                const moveBlock = state.fallingBlock;
                // check grounding
                if (isGrounding(moveBlock)) {
                    // remove
                    state.groundedCells = state.groundedCells.concat(moveBlock);
                    block = null;
                    state.fallingBlock = null;
                } else {
                    // move
                    for (let i = 0; i < moveBlock.length; i++) {
                        moveBlock[i].y = moveBlock[i].y + 1;
                    }
                    block = moveBlock;
                }
                state.lastMovedTime = now.getTime();
            } else {
                // not move
                block = state.fallingBlock;
            }
        }

        // set falling block to cells
        if (block) {
            for (let i = 0; i < block.length; i++) {
                cells[block[i].y][block[i].x] = true;
            }
            state.fallingBlock = block;
        }

        // set grounded cells to cells 
        for (let i = 0; i < state.groundedCells.length; i++) {
            cells[state.groundedCells[i].y][state.groundedCells[i].x] = true;
        }

        renderTable();
    }

    function renderTable() {
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < columnCount; j++) {
                const td = document.querySelector('#cell-' + j + '-' + i);
                if (cells[i][j]) {
                    td.classList.add('exists');
                } else {
                    td.classList.remove('exists');
                }
            }
        }
    }

    function isGrounding(moveBlock) {
        let isGrounded = false;
        for (let i = 0; i < moveBlock.length; i++) {

            let fallenCell = {
                x: moveBlock[i].x,
                y: moveBlock[i].y + 1
            };

            if (fallenCell.y >= rowCount) {
                isGrounded = true;
                break;
            }

            for (let j = 0; j < state.groundedCells.length; j++) {
                if (state.groundedCells[j].x === fallenCell.x
                    && state.groundedCells[j].y === fallenCell.y
                ) {
                    isGrounded = true;
                    break;
                }
            }
        }
        return isGrounded;
    }

    function canMove(now) {
        return (now.getTime() - state.lastMovedTime) >= moveInterval;
    }

    createTable();
    clearCells();
    mainLoop();
})();