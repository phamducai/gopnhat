import ClassBox from 'components/CClassBox';
import CIconSvg from 'components/CIconSvg';
import React from 'react'
import {  useStyleTheme } from 'theme'
import { styleCTipsAndGuides } from './styles/styleCTipsAndGuides';
import { useTranslation } from 'react-i18next';


const CTipsAndGuides = (props: Props): JSX.Element => {
    const classes = useStyleTheme(styleCTipsAndGuides);
    const { t } = useTranslation("translation")
    return (
        <ClassBox className={props.className}>
            <div className={`${classes.title} flex items-center mb-1`}><CIconSvg name="warning-circle" colorSvg="origin" svgSize="default" className="pr-1" />{t("BOOKING.tipsAndGuides")}</div>
            <div className={`${classes.textContent}`}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </div>
        </ClassBox>
    )
}
export default React.memo(CTipsAndGuides)