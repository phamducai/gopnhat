import { IGuestInfo, IHotelInfo, IInvoiceInfo } from 'common/cashier/model-print-folio'
import React, { ReactNode } from 'react'
import moment from 'moment'
import Utils from 'common/utils'
interface FolioPrintProps {
    hotel: IHotelInfo,
    guest: IGuestInfo,
    invoice: IInvoiceInfo
}
export class FolioToPrint extends React.PureComponent<FolioPrintProps> {

    render(): ReactNode {
        return (
            <div className="text-black text-xs">
                <div className="flex justify-between m-4">
                    <div className="w-1/2">{this.props.hotel.logo}</div>
                    <div className="leading-none text-right">
                        <p className='font-bold mb-1'>{this.props.hotel.name}</p>
                        <p className='mb-1'>Add: {this.props.hotel.address}</p>
                        <p className='mb-1'> Tel: {this.props.hotel.tel}</p>
                        <p className='mb-1'>Email: {this.props.hotel.email}</p>
                        <p className='mb-1'>Website: {this.props.hotel.website}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-center font-bold text-2xl">{"GUEST'S INVOICE"}</h3>
                    <div style={{ fontSize: '8px' }} className="text-right italic mx-4">ID No.: <span className="font-bold">16,292</span> / Folio: <span className="font-bold">92741 - 5505</span></div>
                    <div style={{ fontSize: '8px' }} className="flex justify-between mx-4 mt-2 leading-none">
                        <div>
                            <p >
                                Họ tên/Guest Name:
                            </p>
                            <p>
                                Công ty/Company:
                            </p>
                            <p>
                                Địa chỉ/Address:
                            </p>
                        </div>

                        <div className="w-1/3">
                            <p>
                                {this.props.guest.name}
                            </p>
                            <p>
                                {this.props.guest.company}{"a"}
                            </p>
                            <p className="break-all">
                                {this.props.guest.address}
                            </p>

                        </div>
                        <div >
                            <p>
                                Số phòng/Room#:
                            </p>
                            <p>
                                Ngày đến/Arrival:
                            </p>
                            <p>
                                Ngày đi/Departure:
                            </p>
                            <p>
                                Thu ngân/Cashier:
                            </p>
                            <p>
                                Trang số/Page: Page {this.props.invoice.pageNumber} of {this.props.invoice.pageSize}
                            </p>
                        </div>

                        <div>
                            <p>
                                {this.props.invoice.room}
                            </p>
                            <p>
                                {this.props.invoice.arrival}
                            </p>
                            <p>
                                {this.props.invoice.departure}
                            </p>
                            <p>
                                {this.props.invoice.cashier}
                            </p>
                        </div>
                        <div>
                            <p>
                                Pax:2
                            </p>
                            <p>
                                16:05:18
                            </p>
                            <p>
                                00:00:00
                            </p>
                        </div>
                    </div>
                    <div style={{ fontSize: '8px' }} className="flex justify-between mx-4">
                        <span>
                            MST/TAX Code:
                        </span>
                        <span>
                            {this.props.guest.tax}
                        </span>
                        <span>
                            Payment Method:
                        </span>
                        <span>

                        </span>
                        <span>
                            Date/Ngày:
                        </span>
                        <span>
                            {moment().format("MM/DD/YYYY - HH:mm:ss")}
                        </span>
                    </div>
                    <div className="mx-4 border border-black h-96 mb-2">
                        <div className="w-full mb-2 table-print-folio">
                            <div className="flex th font-bold text-center">
                                <div className="cell th w-1/12">NO.</div>
                                <div className="cell th w-1/12"><pre className="m-0">NGÀY</pre> DATE</div>
                                <div className="cell th w-2/12"><pre className="m-0">SỐ BẢNG KÊ</pre> DOCUMENT NO.</div>
                                <div className="cell th w-6/12"><pre className="m-0">DIỄN GIẢI</pre> DESCRIPTION</div>
                                <div className="cell th w-2/12"><pre className="m-0">TỔNG CỘNG</pre> TOTAL</div>
                            </div>
                            <div>
                                {this.props.invoice.foliosList.map((folio, index) =>
                                    <div className="flex tb" key={folio.id}>
                                        <div className="cell text-center w-1/12">
                                            <div className="cell-container">
                                                {++index}
                                            </div>
                                        </div>
                                        <div className="cell text-center w-1/12">
                                            <div className="cell-container">{folio.ngayThang}
                                            </div>
                                        </div>
                                        <div className="cell w-2/12 text-center">
                                            <div className="cell-container">{folio.ma}
                                            </div>
                                        </div>
                                        <div className="cell w-6/12 pl-1">
                                            <div className="cell-container">{folio.dienGiai}
                                            </div>
                                        </div>
                                        <div className="cell w-2/12 pr-1 text-right">
                                            <div className="cell-container">
                                                {folio.thanhTien}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mx-4 border flex border-black">
                        <div style={{ fontSize: '8px' }} className="w-1/2 mx-2 flex flex-col justify-center">
                            <p>Exchange Rate/ Tỷ giá: 23.000</p>
                            <p className="font-bold">Bằng chữ:</p>
                            <p>{Utils.readVietnameseNumber('347000')}</p>
                        </div>
                        <div style={{ fontSize: '8px' }} className="flex justify-between w-1/2 mx-2">
                            <div>
                                <div>Balance Due:</div>
                                <div>Cộng/Amount:</div>
                                <div>Phí/Service Charge (5%):</div>
                                <div>Thuế GTGT/VAT Charge (5%):</div>
                                <div>Tổng/Total Amount (VND):</div>
                                <div>Tổng/Total Amount (USD):</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">900000</div>
                                <div>123981293123</div>
                                <div>9381923</div>
                                <div>9000000000</div>
                                <div className="font-bold">9000000000</div>
                                <div className="font-bold">9000000000</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: '8px' }} className="flex justify-around mt-2">
                        <div className="text-center">
                            <div className="font-bold">Khách hàng/Guest</div>
                            <div>Ký, ghi rõ họ tên/Signature & Full Name</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold">Thu ngân/Cashier</div>
                            <div>Ký, ghi rõ họ tên/Signature & Full Name</div>
                        </div>
                    </div>
                </div>
                <hr className="border-black mx-4 mt-32" />
                <p style={{ fontSize: '8px' }} className="text-center">
                    <i>In từ phần mềm Perfect Key của Công ty TNHH Tin học thương mại Nhị Hà - Mã số thuế: 0103346472 - www.quanlykhachsan.com
                    </i>
                </p>
            </div>
        )
    }

}
