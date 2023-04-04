import ClassBox from 'components/CClassBox'
import React from 'react'
import { Input } from 'antd';
import clsx from 'clsx';
import { createStyles, useStyleTheme } from 'theme';
import { Controller } from 'react-hook-form';
const styleReservationComment = createStyles((theme) => ({
    textArea: {
        "& textarea.ant-input":
        {
            height: "100%",
            borderRadius: 6,
            backgroundColor: "#F5F6F7",
        }
    }
}));
// eslint-disable-next-line
function CCommentArea(props: any): JSX.Element {
    const { TextArea } = Input;
    const { control } = props;
    const classes = useStyleTheme(styleReservationComment);
    return (
        <ClassBox className={clsx(props.className)}>
            <div className={`grid grid-cols-12 pt-4 h-full`} style = {{paddingLeft : 1.5, paddingRight : 1.5}}>
                <p className="font-base font-bold mb-1">Comments:</p>
                <Controller as={<TextArea className={`${classes.textArea} w-full col-span-12`} style={{ height: 140, backgroundColor: "#F5F6F7" }} placeholder="Input comment here" />}
                    name="comment" defaultValue=""  control={control} />
            </div>
        </ClassBox>
    )
}

export default React.memo(CCommentArea)
