import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import { FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import copy from 'copy-to-clipboard'
import { decodePayReq, getTag } from '@zap/utils/crypto'
import { Bar, DataRow, Button, QRCode, Text, Countdown } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import { intlShape } from '@zap/i18n'
import messages from './messages'

const RequestSummary = ({ invoice = {}, payReq, intl, showNotification, ...rest }) => {
  const decodedInvoice = useMemo(() => (payReq ? decodePayReq(payReq) : {}), [payReq])
  const [isExpired, setIsExpired] = useState(false)
  const [expiryDelta, setExpiryDelta] = useState(decodedInvoice.timeExpireDate - Date.now() / 1000)

  useEffect(() => {
    setExpiryDelta(decodedInvoice.timeExpireDate - Date.now() / 1000)
    return () => {
      setIsExpired(false)
    }
  }, [decodedInvoice])

  const copyToClipboard = data => {
    copy(data)
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifBody)
  }

  const { satoshis: invoiceAmount, timestampString } = decodedInvoice
  const satoshis = invoice.finalAmount || invoiceAmount || 0
  const memo = getTag(decodedInvoice, 'description')

  const fallbackTag = getTag(decodedInvoice, 'fallback_address')
  const fallback = fallbackTag && fallbackTag.address

  const getStatusColor = () => {
    if (invoice.isSettled) {
      return 'superGreen'
    }
    return isExpired ? 'superRed' : 'primaryAccent'
  }

  return (
    <Box {...rest}>
      <DataRow
        left={<FormattedMessage {...messages.amount} />}
        right={
          <Flex alignItems="center">
            <CryptoSelector mr={2} />
            <CryptoValue fontSize="xxl" value={satoshis} />
          </Flex>
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.created} />}
        right={<FormattedTime day="2-digit" month="long" value={timestampString} year="numeric" />}
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.current_value} />}
        right={
          <Flex alignItems="center">
            <FiatSelector mr={2} />
            <FiatValue value={satoshis} />
          </Flex>
        }
      />

      {memo && (
        <>
          <Bar variant="light" />
          <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />
        </>
      )}

      {fallback && (
        <>
          <Bar variant="light" />
          <DataRow left={<FormattedMessage {...messages.fallback_address} />} right={fallback} />
        </>
      )}

      <Bar variant="light" />

      <DataRow
        left={
          <>
            <FormattedMessage {...messages.payment_request} />
            {payReq && (
              <>
                <Text
                  className="hint--bottom-left"
                  css="word-wrap: break-word;"
                  data-hint={payReq}
                  fontSize="xs"
                  fontWeight="light"
                  mb={2}
                >
                  <Truncate maxlen={40} text={payReq} />
                </Text>
                <Button onClick={() => copyToClipboard(payReq)} size="small" type="button">
                  <FormattedMessage {...messages.copy_button_text} />
                </Button>
              </>
            )}
          </>
        }
        right={
          <Text>
            {payReq ? (
              <QRCode value={payReq.toUpperCase()} />
            ) : (
              <FormattedMessage {...messages.payment_request_keysend} />
            )}
          </Text>
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.status} />}
        right={
          invoice.isSettled ? (
            <Text
              color={getStatusColor()}
              css="word-break: break-all; text-transform: capitalize;"
              fontWeight="normal"
              textAlign="right"
            >
              <FormattedMessage {...messages.paid} />
              <br />
              <FormattedTime
                day="2-digit"
                month="long"
                value={invoice.settleDate * 1000}
                year="numeric"
              />
            </Text>
          ) : (
            <>
              <Countdown
                color={getStatusColor()}
                countdownStyle="long"
                isContinual={false}
                offset={expiryDelta}
                onExpire={() => setIsExpired(true)}
              />

              <Text color={getStatusColor()} fontWeight="light">
                <FormattedMessage {...messages.not_paid} />
              </Text>
            </>
          )
        }
      />
    </Box>
  )
}

RequestSummary.propTypes = {
  intl: intlShape.isRequired,
  invoice: PropTypes.object.isRequired,
  payReq: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(RequestSummary)
