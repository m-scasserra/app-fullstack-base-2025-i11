function wrapInRow(cardHtmlArray: string[]): string {
    if (cardHtmlArray.length === 0) {
        return "<p>No hay dispositivos guardados en esta categoria.</p>";
    }
    return `<div class="row">${cardHtmlArray.join('')}</div>`;
}