// --- Variables Globales ---
const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER_RED = 1;
const PLAYER_YELLOW = 2;

const boardElement = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('current-player');
const messageDisplay = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

let board = []; // La matriz 2D que representa el estado del tablero
let currentPlayer = PLAYER_RED; // 1 para Rojo, 2 para Amarillo
let gameOver = false;


// --- Funciones del Juego ---

// --- NUEVO: Función para que la IA haga su movimiento ---
async function makeAIMove() {
    if (gameOver) return;

    // Deshabilitar la interacción del usuario mientras la IA piensa
    boardElement.style.pointerEvents = 'none';

    // Pequeño retraso para simular "pensamiento" (mejor UX)
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo de retraso

    let bestMove = -1; // Columna donde la IA hará su movimiento

    // Estrategia de la IA:
    // 1. Ganar el juego
    bestMove = findWinningMove(currentPlayer);
    if (bestMove !== -1) {
        await handleColumnClick(bestMove);
        boardElement.style.pointerEvents = 'auto'; // Re-habilitar
        return;
    }

    // 2. Bloquear al oponente
    const opponentPlayer = currentPlayer === PLAYER_RED ? PLAYER_YELLOW : PLAYER_RED;
    bestMove = findWinningMove(opponentPlayer); // Busca si el oponente puede ganar
    if (bestMove !== -1) {
        await handleColumnClick(bestMove);
        boardElement.style.pointerEvents = 'auto'; // Re-habilitar
        return;
    }

    // 3. Crear amenazas (hacer 3 en raya para la IA)
    bestMove = findConnectingThree(currentPlayer);
    if (bestMove !== -1) {
        await handleColumnClick(bestMove);
        boardElement.style.pointerEvents = 'auto'; // Re-habilitar
        return;
    }

    // 4. Bloquear amenazas del oponente (impedir 3 en raya del oponente)
    bestMove = findConnectingThree(opponentPlayer);
    if (bestMove !== -1) {
        await handleColumnClick(bestMove);
        boardElement.style.pointerEvents = 'auto'; // Re-habilitar
        return;
    }

    // 5. Mover a una columna central si está disponible (heurística básica)
    const centerCols = [3, 2, 4, 1, 5, 0, 6]; // Orden de preferencia para las columnas
    for (const col of centerCols) {
        if (getAvailableRow(col) !== -1) {
            bestMove = col;
            break;
        }
    }

    // 6. Si nada de lo anterior, elegir una columna aleatoria válida
    if (bestMove === -1) {
        let validCols = [];
        for (let c = 0; c < COLS; c++) {
            if (getAvailableRow(c) !== -1) {
                validCols.push(c);
            }
        }
        if (validCols.length > 0) {
            bestMove = validCols[Math.floor(Math.random() * validCols.length)];
        }
    }

    if (bestMove !== -1) {
        await handleColumnClick(bestMove);
    } else {
        // Esto no debería ocurrir si el checkTie funciona, pero es un fallback
        console.warn("IA no encontró un movimiento válido. Tablero posiblemente lleno.");
    }

    boardElement.style.pointerEvents = 'auto'; // Re-habilitar después del movimiento de la IA
}

// --- Funciones auxiliares para la lógica de la IA ---

// Obtiene la fila disponible en una columna
function getAvailableRow(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === EMPTY) {
            return r;
        }
    }
    return -1; // Columna llena
}

// Simula colocar una ficha y verifica si el jugador actual gana
function checkSimulatedWin(boardState, player, row, col) {
    // Esencialmente una copia de checkWin, pero opera sobre un estado de tablero simulado
    const directions = [
        { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }, { dr: 1, dc: -1 }
    ];

    for (const { dr, dc } of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) {
            return true;
        }
    }
    return false;
}

// Busca un movimiento que permita al 'player' dado ganar en el siguiente turno
function findWinningMove(player) {
    for (let c = 0; c < COLS; c++) {
        const r = getAvailableRow(c);
        if (r !== -1) {
            // Simular el movimiento
            board[r][c] = player;
            if (checkSimulatedWin(board, player, r, c)) {
                board[r][c] = EMPTY; // Deshacer la simulación
                return c; // Encontramos un movimiento ganador
            }
            board[r][c] = EMPTY; // Deshacer la simulación
        }
    }
    return -1; // No se encontró un movimiento ganador
}

// Busca un movimiento que cree 3 en raya para el 'player' dado
function findConnectingThree(player) {
    for (let c = 0; c < COLS; c++) {
        const r = getAvailableRow(c);
        if (r !== -1) {
            // Simular el movimiento
            board[r][c] = player;
            // Después de colocar, verificar si tenemos 3 en línea (y no 4, que ya lo manejaría findWinningMove)
            if (checkSimulatedConnectCount(board, player, r, c, 3)) {
                board[r][c] = EMPTY; // Deshacer la simulación
                return c;
            }
            board[r][c] = EMPTY; // Deshacer la simulación
        }
    }
    return -1;
}

// NUEVA FUNCIÓN: Comprueba si se obtiene un número específico de fichas conectadas (ej. 3)
function checkSimulatedConnectCount(boardState, player, row, col, targetCount) {
    const directions = [
        { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }, { dr: 1, dc: -1 }
    ];

    for (const { dr, dc } of directions) {
        let count = 1;
        // Comprobar en una dirección
        for (let i = 1; i < targetCount; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        // Comprobar en la dirección opuesta
        for (let i = 1; i < targetCount; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        if (count >= targetCount) {
            return true;
        }
    }
    return false;
}

// Inicializa el tablero lógico (matriz) y el tablero visual (DOM)
function initializeGame() {
    board = Array(ROWS).fill(0).map(() => Array(COLS).fill(EMPTY));
    gameOver = false;
    // Ahora, en lugar de limpiar completamente, puedes establecer el mensaje inicial si lo deseas,
    // o simplemente dejar que la lógica del juego lo reemplace cuando sea necesario.
    messageDisplay.textContent = ''; // Limpiar el mensaje si ya hay uno de una partida anterior
    messageDisplay.textContent = '¡A jugar Conecta 4!'; // Opcional: Re-establecer el mensaje inicial
    messageDisplay.style.color = '#555'; // Color neutro para el mensaje inicial
    restartButton.style.display = 'none';
    currentPlayer = PLAYER_RED;
    updateCurrentPlayerDisplay();
    drawBoard();
}
// Actualiza el texto del turno
function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = currentPlayer === PLAYER_RED ? 'Rojo' : 'Amarillo';
    currentPlayerDisplay.style.color = currentPlayer === PLAYER_RED ? '#dc3545' : '#ffc107';
}

// Dibuja/Redibuja el tablero en el HTML
function drawBoard() {
    boardElement.innerHTML = ''; // Limpia el tablero actual

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;

            // Añadir una ficha si existe en el estado lógico del tablero
            if (board[r][c] !== EMPTY) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add(board[r][c] === PLAYER_RED ? 'red' : 'yellow');
                cell.appendChild(piece);
                // Asegurarse de que la ficha esté en su posición final al redibujar
                piece.style.bottom = '0';
                piece.style.transition = 'none'; // Desactivar transición para el redibujado instantáneo
            }
            boardElement.appendChild(cell);
        }
    }
}

// Maneja el clic en una columna para dejar caer una ficha
async function handleColumnClick(col) {
    if (gameOver) return;
    let availableRow = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] === EMPTY) {
                availableRow = r;
                break;
            }
        }

        if (availableRow !== -1) {
            const cellToDropInto = boardElement.querySelector(`[data-row="${availableRow}"][data-col="${col}"]`);
            
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.classList.add(currentPlayer === PLAYER_RED ? 'red' : 'yellow');
            cellToDropInto.appendChild(piece);
            
            void piece.offsetWidth; 
            piece.style.bottom = '0'; 

            await new Promise(resolve => {
                piece.addEventListener('transitionend', resolve, { once: true });
            });

            board[availableRow][col] = currentPlayer; // Actualizar el tablero lógico

            if (checkWin(availableRow, col)) {
                messageDisplay.textContent = `¡Gana el jugador ${currentPlayer === PLAYER_RED ? 'Rojo' : 'Amarillo'}!`;
                messageDisplay.style.color = currentPlayer === PLAYER_RED ? '#dc3545' : '#ffc107';
                gameOver = true;
                restartButton.style.display = 'block';
                disableColumnHover();
                return; // Termina la función aquí si hay un ganador
            }

            if (checkTie()) {
                messageDisplay.textContent = '¡Empate!';
                messageDisplay.style.color = '#555';
                gameOver = true;
                restartButton.style.display = 'block';
                disableColumnHover();
                return; // Termina la función aquí si hay un empate
            }

            // --- Nuevo: Lógica para la IA ---
            currentPlayer = currentPlayer === PLAYER_RED ? PLAYER_YELLOW : PLAYER_RED;
            updateCurrentPlayerDisplay();

            if (currentPlayer === PLAYER_YELLOW) { // Si el turno es de la IA (Amarillo)
                await makeAIMove(); // Esperar a que la IA haga su movimiento
            }
        }
    }

// Comprueba si hay un ganador después de colocar una ficha
function checkWin(row, col) {
    const player = board[row][col];

    // Direcciones para comprobar: horizontal, vertical, diagonal (\ y /)
    const directions = [
        { dr: 0, dc: 1 },  // Horizontal
        { dr: 1, dc: 0 },  // Vertical
        { dr: 1, dc: 1 },  // Diagonal /
        { dr: 1, dc: -1 }  // Diagonal \
    ];

    for (const { dr, dc } of directions) {
        let count = 1; // Ya tenemos 1 ficha colocada
        
        // Comprobar en una dirección
        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }

        // Comprobar en la dirección opuesta
        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 4) {
            return true; // ¡Ganador!
        }
    }
    return false;
}

// Comprueba si el tablero está lleno (empate)
function checkTie() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === EMPTY) {
                return false; // Todavía hay espacios vacíos
            }
        }
    }
    return true; // El tablero está lleno
}

// Habilita/Deshabilita el hover en las columnas (para evitar clics después de ganar/empatar)
function enableColumnHover() {
    boardElement.addEventListener('mouseover', handleMouseOver);
    boardElement.addEventListener('mouseout', handleMouseOut);
}

function disableColumnHover() {
    boardElement.removeEventListener('mouseover', handleMouseOver);
    boardElement.removeEventListener('mouseout', handleMouseOut);
    // Asegurarse de que no quede ningún hover activado
    document.querySelectorAll('.column-hover').forEach(cell => cell.classList.remove('column-hover'));
}

// Maneja el hover del ratón sobre las celdas para resaltar la columna
function handleMouseOver(event) {
    if (gameOver) return;
    const cell = event.target.closest('.cell');
    if (cell) {
        const col = parseInt(cell.dataset.col);
        // Resaltar toda la columna
        for (let r = 0; r < ROWS; r++) {
            const targetCell = boardElement.querySelector(`[data-row="${r}"][data-col="${col}"]`);
            if (targetCell) {
                targetCell.classList.add('column-hover');
            }
        }
    }
}

function handleMouseOut(event) {
    if (gameOver) return;
    const cell = event.target.closest('.cell');
    if (cell) {
        const col = parseInt(cell.dataset.col);
        // Quitar el resaltado de toda la columna
        for (let r = 0; r < ROWS; r++) {
            const targetCell = boardElement.querySelector(`[data-row="${r}"][data-col="${col}"]`);
            if (targetCell) {
                targetCell.classList.remove('column-hover');
            }
        }
    }
}


// --- Event Listeners ---

// Al hacer clic en el tablero, determinamos en qué columna se hizo clic
boardElement.addEventListener('click', (event) => {
    if (gameOver) return;
    // Solo permitir clic si es el turno del jugador humano (Rojo)
    if (currentPlayer === PLAYER_RED) {
        const cell = event.target.closest('.cell');
        if (cell) {
            const col = parseInt(cell.dataset.col);
            handleColumnClick(col);
        }
    }
});

restartButton.addEventListener('click', initializeGame);

// --- Inicio del Juego ---
initializeGame();
enableColumnHover(); // Habilitar el hover al inicio