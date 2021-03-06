import { connect } from 'react-redux'
import PaySummaryLightning from 'components/Pay/PaySummaryLightning'
import { settingsSelectors } from 'reducers/settings'
import { tickerSelectors } from 'reducers/ticker'
import { networkSelectors } from 'reducers/network'
import { openModal } from 'reducers/modal'

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isQueryingRoutes: state.pay.isQueryingRoutes,
  nodes: networkSelectors.nodes(state),
  feeLimit: settingsSelectors.currentConfig(state).payments.feeLimit,
})

const mapDispatchToProps = {
  openModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(PaySummaryLightning)
