function wrapInRow(cardHtmlArray: string[]): string {
    if (cardHtmlArray.length === 0) {
        return "<p>No devices found in this category.</p>"; // Or return empty string
    }
    return `<div class="row">${cardHtmlArray.join('')}</div>`;
}