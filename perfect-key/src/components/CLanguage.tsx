import { Dropdown, Menu } from 'antd';
import clsx from 'clsx';
import { LanguageType } from 'common/define-type';
import { setLanguage } from 'i18n/i18next-config';
import ImgEn from 'image/en.png';
import ImgVi from 'image/vi.png';
import React from 'react';
import { changeLanguage } from 'redux/controller';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import CIconSvg from './CIconSvg';

function Language(props: Props): JSX.Element {
    const currentLang = useSelectorRoot(state => state.app.language);
    const dispatch = useDispatchRoot();

    const renderLangs: Record<LanguageType, { img: string, name: string }> = {
        en: { img: ImgEn, name: 'English' },
        vi: { img: ImgVi, name: 'Tiếng việt' },
    }
    const infoCurrent = renderLangs[currentLang];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onHandleClick(event: any) {
        if (typeof event.key !== 'undefined') {
            dispatch(changeLanguage(event.key));
            setLanguage(event.key);
        }
    }
    const renderMenuItem = (
        <Menu onClick={onHandleClick}>
            {
                Object.keys(renderLangs).map(lg => {
                    const item = renderLangs[lg as LanguageType];
                    const isSelected = currentLang === lg;
                    return (
                        <Menu.Item key={lg} className={clsx(
                            isSelected && 'bg-blue-400 text-white'
                        )}>
                            <div className='flex items-center justify-between space-x-3'>
                                <img height={20} width={30} src={item.img} alt={item.name} />
                                <span>{item.name}</span>
                            </div>
                        </Menu.Item>
                    )
                })
            }
        </Menu>
    )
    return (
        <Dropdown overlay={renderMenuItem} trigger={['click']} placement="bottomRight">
            <div className="flex items-center space-x-1 cursor-pointer">
                <img height={20} width={30} src={infoCurrent.img} alt={infoCurrent.name} />
                <div className="bg-gray-200 w-4 h-4 rounded-full flex justify-center items-center">
                    <CIconSvg name="chevron-down" svgSize="small" />
                </div>
            </div>
        </Dropdown>
    )
}

const CLanguage = React.memo(Language);
export default CLanguage