/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {BundleCard, Button, Header, SeparatorBar} from '../../../Components';

import {useIAP} from '../../../Components/Providers/IAP.Provider';
import gstyles from '../../../styles';

const BUNDLES = {
  'com.sholiv.message.bundle': {
    artist_subscribe: 0,
    createdAt: '2024-01-08T11:37:15.771Z',
    description: null,
    expiry_days: 0,
    id: 10,
    is_free: false,
    live_stream: 0,
    messages: 10,
    name: 'Message Bundle',
    isBoost: true,
    perks: ['Messages: 10', 'Xclusive Artist Follow: 0'],
    price: 2,
    type: 5,
    updatedAt: '2024-01-08T11:37:15.771Z',
  },
  'com.sholiv.message.single': {
    artist_subscribe: 0,
    createdAt: '2024-01-08T11:37:15.771Z',
    description: null,
    expiry_days: 0,
    id: 10,
    is_free: false,
    live_stream: 0,
    messages: 1,
    name: 'Single Message',
    isBoost: true,
    perks: ['Messages: 1', 'Xclusive Artist Follow: 0'],
    price: 2,
    type: 5,
    updatedAt: '2024-01-08T11:37:15.771Z',
  },
};

const Bundles = ({route}) => {
  const planType = route?.params?.type ?? 'bundle';

  const {
    plans: {messagePlans},
    handlePurchase,
  } = useIAP();

  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <View style={gstyles.container}>
      <Header back={true} title={'Buy Bundle'} isIcon={false} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={gstyles.marginVertical30}>
          <SeparatorBar />
        </View>
        {messagePlans?.map((plan, index) => (
          <TouchableOpacity
            key={plan.id}
            onPress={() => setSelectedPlan(plan.id)}>
            <BundleCard
              plan={{
                name: BUNDLES[plan.id].name,
                price: plan.localizedPrice,
                artist_subscribe: 0,
                messages: BUNDLES[plan.id].messages,
              }}
              selectedPlan={selectedPlan === plan.id}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{marginBottom: 20}}>
        <Button
          buttonText="Buy Bundle"
          disabled={!selectedPlan}
          onPress={() => handlePurchase(selectedPlan)}
        />
      </View>
    </View>
  );
};

export default Bundles;
