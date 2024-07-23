import { useState } from "react";
import ViewOrder from "../../components/Order/ViewOrder";
import { Steps } from "antd";
import Payment from "../../components/Order/Payment";
import './order.scss';

const OrderPage = (props) => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="order-container" style={{ maxWidth: 1850, margin: '0 auto' }}>
                    <div className="order-steps">
                        <Steps
                            size="small"
                            current={currentStep}
                            items={[
                                {
                                    title: 'Đơn hàng',
                                },
                                {
                                    title: 'Đặt hàng',
                                },
                                {
                                    title: 'Thanh toán',
                                },
                            ]}
                        />
                    </div>
                    {currentStep === 0 &&
                        <ViewOrder setCurrentStep={setCurrentStep} />
                    }
                    {currentStep === 1 &&
                        <Payment setCurrentStep={setCurrentStep} />
                    }
                </div>
            </div>
        </>
    )
}

export default OrderPage;
