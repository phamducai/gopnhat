/* eslint-disable @typescript-eslint/no-explicit-any */
import Utils from 'common/utils'
import React, { ReactNode } from 'react'

export class ReservationConfirmPrint extends React.PureComponent<any> {

    render(): ReactNode {
        return (
            <div style={{ fontSize: "10px" }} className="my-5 mx-7 text-black">
                <section className="flex justify-center">
                    <div></div>
                    <div className="font-bold text-lg">
                        <div>SAIGON-QUYNHON HOTEL</div>
                        <div>RESERVATION CONFIRMATION</div>
                    </div>
                </section>
                <section className="border-2 mt-2 border-black">
                    <div className="border-b-2 border-black flex justify-between py-1">
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    First Name
                                </p>
                                <p className="mb-0">
                                    Last Name
                                </p>
                            </div>
                            <div className="font-bold uppercase">
                                <p>
                                    Son
                                </p>
                                <p className="mb-0">
                                    Nguyen Duc
                                </p>
                            </div>
                        </div>
                        <div>
                            <p>
                                Title:
                            </p>
                        </div>
                        <div className="mx-16 font-bold">
                            <p>
                                Reservation#: {"1759"}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between border-b-2 border-black py-1">
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Profession
                                </p>
                                <p className="mb-0">
                                    Address
                                </p>
                            </div>
                            <div>
                                <p>
                                    Son
                                </p>
                                <p className="mb-0">
                                    Nguyen Duc
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Zip
                                </p>
                                <p className="mb-0">
                                    Country
                                </p>
                            </div>
                            <div className="mx-3 mr-20">
                                <p>
                                    7000000
                                </p>
                                <p className="mb-0">
                                    VietNam
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between border-b-2 border-black py-1">
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Arrival:
                                </p>
                                <p className="mb-0">
                                    Departure:
                                </p>
                            </div>
                            <div>
                                <p className="font-bold">
                                    Date1
                                </p>
                                <p className="font-bold mb-0">
                                    Date2
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Room Type:
                                </p>
                                <p className="mb-0">
                                    Rate:
                                </p>
                            </div>
                            <div>
                                <p className="font-bold">
                                    Deluxe Twin
                                </p>
                                <p className="font-bold mb-0">
                                    900,000
                                </p>
                            </div>

                        </div>
                        {this.props.isGroup ? (
                            <div className="flex">
                                <div className="mx-3">
                                    <p>
                                        Room#:
                                    </p>
                                    <p className="mb-0">
                                        Deposite:
                                    </p>
                                </div>
                                <div className="mx-3 mr-28">
                                    <p className="font-bold">
                                        517
                                    </p>
                                    <p className="mb-0">
                                        0
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex">
                                    <div className="mx-3">
                                        <p>
                                            No. of Guests:
                                        </p>
                                        <p className="mb-0">
                                            Room#:
                                        </p>
                                    </div>
                                    <div >
                                        <p>
                                            517
                                        </p>
                                        <p className="mb-0">
                                            0
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="mx-3">
                                        <p>
                                            No. of Rooms:
                                        </p>
                                        <p className="mb-0">
                                            Deposite:
                                        </p>
                                    </div>
                                    <div className="mx-3">
                                        <p>
                                            517
                                        </p>
                                        <p className="mb-0">
                                            0
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-between border-b-2 border-black py-1">
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Nationality
                                </p>
                                <p className="mb-0">
                                    Passport
                                </p>
                            </div>
                            <div>
                                <p>
                                    Son
                                </p>
                                <p className="mb-0">
                                    Nguyen Duc
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Date of Birth
                                </p>
                                <p className="mb-0">
                                    Visa#: {"1759"}
                                </p>
                            </div>
                            <div>
                                <p>
                                    18/09/1999
                                </p>
                                <p className="mb-0">
                                    18/09/1999
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mx-3">
                                <p className="text-transparent">
                                    null
                                </p>
                                <p className="mb-0">
                                    Expired Date:
                                </p>
                            </div>
                            <div className="mx-3 mr-9">
                                <p className="text-transparent">
                                    null
                                </p>
                                <p className="mb-0">
                                    20/11/2021
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-b-2 border-black py-1">
                        <div className="flex justify-start">
                            <span className="mx-3">
                                Payment
                            </span>
                            <span className="mx-3">
                                Web
                            </span>
                            <span className="mx-3">
                                Own AC
                            </span>
                            <span className="mx-3">
                                Input Own AC
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between border-b-2 border-black py-1">
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Company:
                                </p>
                                <p className="mb-0">
                                    Agent:
                                </p>
                            </div>
                            <div>
                                <p>
                                    Dự Án Phát Triển GD THPT Giai Đoạn 2
                                </p>
                                <p className="mb-0">
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Package:
                                </p>
                                <p className="mb-0">
                                    Special:
                                </p>
                            </div>
                            <div className="mx-3 mr-20">
                                <p>
                                    Package:
                                </p>
                                <p className="mb-0">
                                    Special:
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-b-2 border-black pb-14">
                        <div className="mx-3">
                            <p>
                                Remark:
                            </p>
                        </div>
                        <div>
                            <p>
                                Khách sẽ tự thanh toán ngay khi trả phòng.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Book By:
                                </p>
                                <p className="mb-0">
                                    Fax:
                                </p>
                            </div>
                            <div>
                                <p>
                                    Book By:
                                </p>
                                <p className="mb-0">
                                    Fax:
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mx-3">
                                <p>
                                    Phone
                                </p>
                                <p className="mb-0">
                                    Email:
                                </p>
                            </div>
                            <div className="mx-3 mr-14">
                                <p>
                                    0923812312
                                </p>
                                <p className="mb-0">
                                    abc@abc.com
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {this.props.isGroup &&
                    <table style={{ fontSize: "10px" }} className='table w-full my-2 h-full text-sm'>
                        <thead className="border-black border-b-2">
                            <tr>
                                <th className="text-left">Room Type</th>
                                <th>Rate</th>
                                <th>Number Of Rooms</th>
                                <th>Number Of Guests</th>
                            </tr>
                        </thead>
                        <tbody className="text-center border-black border-b-2 leading-6">
                            <tr>
                                <td className="text-left">Room Type</td>
                                <td>{Utils.formatNumber(232323)}</td>
                                <td>8</td>
                                <td>9</td>
                            </tr>
                            <tr>
                                <td className="text-left">Room Type</td>
                                <td>{Utils.formatNumber(232323)}</td>
                                <td>8</td>
                                <td>9</td>
                            </tr>
                            <tr>
                                <td className="text-left">Room Type</td>
                                <td>{Utils.formatNumber(232323)}</td>
                                <td>8</td>
                                <td>9</td>
                            </tr>
                            <tr>
                                <td className="text-left">Room Type</td>
                                <td>{Utils.formatNumber(232323)}</td>
                                <td>8</td>
                                <td>9</td>
                            </tr>
                            <tr>
                                <td className="text-left">Room Type</td>
                                <td>{Utils.formatNumber(232323)}</td>
                                <td>8</td>
                                <td>9</td>
                            </tr>
                        </tbody>
                        <tfoot className="font-bold text-center  border-black border-b-2 leading-9">
                            <tr>
                                <td colSpan={2}>Total:</td>
                                <td>8</td>
                                <td>$9</td>
                            </tr>
                        </tfoot>
                    </table>
                }

                <section className="flex justify-between mt-2">
                    <div className="w-1/3">
                        <p className="italic font-bold text-justify">
                            The above room charge is included to 5% services
                            charge and 10% goverment tax
                        </p>
                    </div>
                    <div className="flex ">
                        <div className="mr-6">
                            <p className="font-bold">
                                Reservation Staff:
                            </p>
                            <p>
                                Telephone:
                            </p>
                            <p>
                                Fax:
                            </p>
                            <p>
                                Email:
                            </p>
                        </div>
                        <div>
                            <p className="font-bold">
                                ...........NhiHa
                            </p>
                            <p>
                                (84-56) 3 829 92
                            </p>
                            <p>
                                (84-56) 3 829 92
                            </p>
                            <p>
                                Sales@saigonquynhonhotel.com.vn
                            </p>
                        </div>
                    </div>

                </section>
                <div className="flex justify-between">
                    <div className="w-1/3"></div>
                    <div >
                        <p>Addr: No 24 - Nguyen Hue Str., - Quy Nhon - Binh Dinh, - Vietnam</p>
                    </div>
                </div>
            </div>
        )
    }
}