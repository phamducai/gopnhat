/* eslint-disable */
import CModel from 'components/CModal';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useStyleTheme } from 'theme';
import { Tabs } from 'antd';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import CLoading from 'components/CLoading';
import MappingTabPane from '../TracerColumn/ChannelManagerTabs/MappingTabPane';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { setRoomTypeLoadPage } from 'redux/controller';
import { StickyContainer, Sticky } from 'react-sticky';
import SetInventoryTabPane from '../TracerColumn/ChannelManagerTabs/SetInventoryTabPane';
const { TabPane } = Tabs;
interface PropsChannelManagerModal {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    isShowModal: boolean,
}
const renderTabBar = (props: any, DefaultTabBar: any): React.ReactElement => (
    <Sticky bottomOffset={80}>
        {({ style }) => (
            <DefaultTabBar {...props} className="site-custom-tab-bar" style={{ ...style }} />
        )}
    </Sticky>
);

export const ChannelManagerModal = ({ setShowModal, isShowModal }: PropsChannelManagerModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const dispatch = useDispatchRoot()
    const maxHeight = 550;


    const { hotelId } = useSelectorRoot(state => state.app)
    const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onCancel = () => {
        setShowModal(false)
    }
    const toggleLoading = () => {
        setLoadingBtn((prevState) => !prevState);
        setLoading((prevState) => !prevState)
    }
    const handleOnChange = (key: string) => {
        console.log(key);

    }
    const fetchData = async () => {
        toggleLoading();
        dispatch(setRoomTypeLoadPage({ hotelGuid: hotelId }))
        toggleLoading();
    }

    useEffect(() => {
        isShowModal && fetchData();
        //eslint-disable-next-line
    }, [isShowModal])
    return (
        <CModel
            style={{ top: "2%", paddingTop: "0px", paddingBottom: "0px" }}
            isLoading={loadingBtn}
            visible={isShowModal}
            title={t("MISCELLANEOUS.channelManager")}
            onCancel={onCancel}
            width={"80%"}
            isShowFooter={false}
            className="custom-scrollbar-pkm"
            onOk={() => console.log("submit")}
            content={
                <CLoading visible={loading}>
                    <StickyContainer>
                        <Tabs defaultActiveKey='tab1' style={{ marginTop: "-1rem" }} className={`${classes.tab}`} onChange={handleOnChange} type="card" renderTabBar={renderTabBar}>
                            <TabPane className='custom-scrollbar-pkm pr-1' style={{ height: maxHeight, overflowY: 'auto' }} tab={t("MISCELLANEOUS.roomTypeMapping")} key="tab1">
                                <MappingTabPane />
                            </TabPane>
                            <TabPane className='custom-scrollbar-pkm pr-1' style={{ height: maxHeight, overflowY: 'auto' }} tab={t("MISCELLANEOUS.setInventory")} key="tab2">
                                <SetInventoryTabPane />
                            </TabPane>
                        </Tabs>
                    </StickyContainer>
                </CLoading >
            }
        />
    );
}
