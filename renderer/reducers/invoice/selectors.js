import { createSelector } from 'reselect'
import { decorateInvoice } from './utils'

/**
 * @typedef {import('../index').State} State
 * @typedef {import('./reducer').Invoice} Invoice
 */

/**
 * invoicesSelector - List of invoices.
 *
 * @param {State} state Redux state
 * @returns {Invoice[]} List of invoices
 */
const invoicesSelector = state => state.invoice.invoices

/**
 * invoiceSelector - Currently selected invoice.
 *
 * @param {State} state Redux state
 * @returns {string|null} Currently selected invoice
 */
const invoiceSelector = state => state.invoice.invoice

/**
 * invoices - List of decorated invoices.
 *
 * @param {State} state Redux state
 * @returns {Invoice[]} List of decorated invoices
 */
export const invoices = createSelector(invoicesSelector, item => item.map(decorateInvoice))

/**
 * invoice - Currently selected invoice.
 *
 * @param {State} state Redux state
 * @returns {Invoice|null} Currently selected decorated invoice
 */
export const invoice = createSelector(invoices, invoiceSelector, (allInvoices, paymentRequest) =>
  allInvoices.find(item => item.paymentRequest === paymentRequest)
)

export default {
  invoice,
  invoices,
}
