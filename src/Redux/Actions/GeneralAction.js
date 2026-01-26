import {Component} from 'react';

export class GeneralAction extends Component {
  static RefetchListingAction(data) {
    return {type: 'REFETCH_LISTINGS', payload: null};
  }
  static RefetchCommPostAction(data) {
    return {type: 'REFETCH_COMM_POST', payload: null};
  }
  static RefetchNotification(data) {
    return {type: 'REFETCH_NOTIFICATIONS', payload: null};
  }
  static IapPurchaseLoader(payload) {
    return {type: 'IAP_LOADER', payload};
  }
}

export default GeneralAction;
