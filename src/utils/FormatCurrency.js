const CURRENCY_FORMATER = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'egp',
})
export function formatCurrency(price) {
    return CURRENCY_FORMATER.format(price)
}