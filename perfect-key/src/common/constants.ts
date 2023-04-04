
const SYSTEM_CONSTANTS = {
    API: {
        LISTHOTEL: {
            DEPARTMENT: 'api/Employee/me',
            HOTEL: 'api/OperationCenter/me'
        },
        IDENTITY: {
            CONNECT_TOKEN: 'identity/clients/publicKey',
            LOGIN: "identity/connect/token",
            FORGOT: "license_manager/users"
        },
        RSVN: {
            RESERVATION: 'api/RSVN',
            RSVN_QUERYPARAM: 'api/RSVN/QueryParam',
            RESERVATED_ROOMS: 'api/RSVN/ReservatedRooms/roomtypeIds',
            RESERVATED_ROOMS_CUSTOM: 'api/RSVN/ReservatedRoomsCustomer/roomtypeIds',
            RSVN_ACTIVE: "api/TransactRoom/setStatusTransactRoom",
            GET_BOOKING_BY_RSVNID: "api/RSVN/EditData/RsvnId",
            ALLOTMENT: "api/RSVN/NewAllotment/true",
            SET_STATUS_RSVN: "api/TransactRoom/Status/multi",
            RSVN_TRACER: {
                SEACH_TRACER_MESSAGE: "api/RSVNTracer/QueryTracerMessages",
                GET_TRACER_MESSAGE: "api/RSVNTracer/GetTracerMessages",
                POST_TRACER_MESSAGE: "api/RSVNTracer/TracerMessages",
                POST_TRACER_MESSAGE_OPTION: "api/RSVNTracer/TracerMessagesByOption",
                POST_MESSAGE: "api/RSVNTracer/Message",
                POST_MESSAGE_OPTION: "api/RSVNTracer/PostMessageByOption",
                SEACH_MESSAGE: "api/RSVNTracer/QueryMessages",
                POST_TRACE_IN_HOUSE: "api/RSVNTracer/TraceInHouse",
                GET_TRACE_IN_HOUSE: "api/RSVNTracer/TraceInHouse"
            },
            STATISTIC: {
                GET_ROOM_AND_GUEST_BY_DATE: "api/Statistic/FrontDesk",
                REVENUE_DAY: "api/Statistic/RevenueInDays",
                SOURCE_MARKET: "api/Statistic/RevenueBySourceMarket"
            },
            UPDATE_GROUP_RSVN: "api/RSVN/Edit/RsvnId",
            TRANSACTROOM: {
                GET_TRS_INFO: 'api/TransactRoom/{id}',
                UPDATE: '/api/TransactRoom',
                CONFIRM: "api/TransactRoom/Confirm",
                CONFIRM_BY_RSVN: "api/TransactRoom/ConfirmsByRsvn",
                STATUS: "api/TransactRoom/Confirm",
                STATUS_BY_RSVN: "api/TransactRoom/StatusByRsvn",
                GET_TRANSACTROOM_BY_ID: "api/TransactRoom",
                ADD_PM: "api/TransactRoom/TransactRoom/AddPM",
                CANCEL_PM: "api/TransactRoom/TransactRoom/CancelPM",
                ADD_GROUP_MASTER: "api/TransactRoom/TransactRoom/AddGrMaster",
                UNSET_GROUP_MASTER: "api/TransactRoom/TransactRoom/UnsetGrMaster",
                ADD_SHARED_GUEST: "api/TransactRoom/AddShareGuest",
                ADD_COMMENT_TRANSACTROOM: "api/TransactRoom/Comment",
                CHANGE_STATUS_TRANSACTROOMS: "api/TransactRoom/Status/multi",
                CHANGE_MAIN_GUEST: "api/TransactRoom/MainGuest/OldMainTrRoom/OldMainTrRoomId/NewMainTrRoom/NewMainTrRoomId",
                GET_TRANSACTROOM_BY_STATUS: "api/TransactRoom/TransactRoomByStatus",
                GET_GUEST_HISTORY_YEAR: "api/TransactRoom/GetGuestHistoryYear",
                GET_COMPANY_AGENT_HISTORY_YEAR: "api/TransactRoom/GetCompanyOrAgentHistoryYear",
                EDIT_GUEST: "api/TransactRoom/OldGuestId",
                EDIT_COMPANY: "api/TransactRoom/OldCompanyAgentGuid",
                GET_SHARESGUEST_TRSROOM: "api/TransactRoom/SharedGuestByTsRoom/tsRoomId"
            },
            TRANSACTROOM_GROUP: {
                TSROOM_EDIT_BY_ID: "api/TransactRoomsGroups/EditRsvn/trsRoomID",
                UNASSIGN: "api/TransactRoomsGroups/Unassign",
                ASSIGNROOM: "api/TransactRoomsGroups/AssignRoom",
                UPDATE_ROOM_GROUP: "api/TransactRoomsGroups/EditTrRoom/trsRoomID",
                GET_TRANSACTION_ROOM_UNASSIGN: "api/TransactRoomsGroups/UnassignedRoomList",
                STAT_BOOKING: "api/TransactRoomsGroups/StateBookingGroup",
                USER_ROOM_DETAIL: "api/TransactRoomsGroups/UsedRoomDetail",
                HAS_USER_ROOM: "api/TransactRoomsGroups/UsedRoom",
                ROOMLIST: "api/TransactRoomsGroups/RoomLists",
                TOTAL_ROOM_BOOKED: "api/TransactRoomsGroups/GetTotalRoomBooked"
            },
            RSVN_COMBINE_GUEST: 'api/TransactRoom/CombineGuest',
            RSVN_DATA: 'api/RSVN/EditData/RsvnId',
            RSVN_SEARCH_ROOMRACK: 'api/TransactRoomsGroups/RoomRack',
            RSVN_UPDATE_ROOMRACK: 'api/TransactRoomsGroups/UpdateTaskRoomRack',
            RSVN_SEARCH_ROOM_PLAN: 'api/TransactRoomsGroups/RoomLists',
            BREAK_SHARED: 'api/TransactRoomsGroups/BreakShare',
            WALK_IN: 'api/RSVN/Walkin',
            UPDATE_RESERVATION: "api/RSVN/EditRsvn/trsRoomID",
            UPDATE_GROUP_RESERVATION: "api/RSVN/Edit/MultiTsRoom",
            DMUC_COLOR_TYPE: 'RSVN/DMUC/ColorType',
            COUNT_OF_RSVN: 'api/RSVN/Count/Hotel/{hotelId}',
            DMUC_TUY_CHON_EXTRABED: 'RSVN/DMUC/DMucTuyChon/extraBedUsed',
            DMUC_TUY_CHON_SERVICE_VAT: 'RSVN/DMUC/DMucTuyChon/ServiceAndVAT',
            SMALL_FUNC_EDIT_GROUP: 'api/RSVN/SmallFuncEditGroup/rsvnId',
            CHECK_IN_TO_RSVN: "api/RSVN/CheckInToRSVN",
            CHECK_IN_TO_GROUP: "api/RSVN/CheckInToGroup",
            LIST_GUEST_GUID_PROFILE: "api/RSVN/GuestId/rsvnId",
            RUN_NIGHT: {
                ROOM_REVENUE: "api/RunNight/GetRoomRevenue",
                GET_INFOR_NIGHT_BY_QUERY: "api/RunNight/QueryInforRunNight"
            },
            CHECK_OUT_ROOM: "api/RSVN/CheckOutRSVN",
            CHECK_OUT_GROUP: "api/RSVN/CheckOutGroup",
            DMUC_TUY_CHON_BY_MA: "RSVN/DMUC/DMucTuyChon/GetByMa"
        },
        INV: {
            ROOM: 'api/INV/Room/All',
            EDITROOM: 'api/INV/Room',
            ROOM_TYPE: 'api/INV/RoomType',
            ROOM_TYPE_INFO: 'api/INV/RoomType/Infos',
            ALL_ROOMS_IN_ROOMTYPE: 'api/INV/RoomType/Room',
            ROOMS_IN_ROOMTYPES: 'api/INV/RoomsInRoomTypes',
            FLOOR_BY_HOTEL: 'api/INV/Floors',
            SEARCH_BY_ROOM_NO: 'api/INV/Room/SearchByRoomNo',
            AVAILABLE_ROOMS: 'api/INV/AvailableRoom',
            STATISTIC: {
                HOUSE_KEEPING: "api/Statistic/HouseKeeping"
            },
            TOTAL_ROOM_HOTEL: "api/INV/GetTotalRoomByHotelId",
            GET_LIST_STATUS_ROOM: "api/INV/GetListStatusRoomByHotelId",
            GET_ROOM_TYPE_PM_ID: "api/RunNight/GetRoomIdPmByHotelId",
            UPDATE_STATUS_ROOM: "api/INV/UpdateStatusRoom"
        },
        PRF: {
            GUEST_PROFILES: 'api/PRF/GuestProfiles',
            GUEST_NEW_PROFILES: 'api/PRF/GuestProfile',
            DELETE_GUEST: "api/PRF/GuestProfile",
            COMPANY_PROFILE: 'api/PRF/CompanyProfile',
            GUEST_PROFILES_SEARCH: 'api/PRF/GuestProfile/Search',
            POST_MAIN_AND_MEMBER_PROFILES: 'api/PRF/GuestProfile/MainAndMembers',
            GET_PROFILE_BY_GUEST_ID: 'api/PRF/GuestProfile',
            COMPANY_PROFILE_GUID: 'api/PRF/CompanyProfile/hotelGuid',
            CREATE_PROFILE_BY_COUNT_GUEST: 'api/PRF/GuestProfiles',
            LIST_GUEST_PROFILES: 'api/PRF/ListGuestProfiles',
            GUEST_PROFILE_RUN_NIGHTS: 'api/PRF/GuestProfilesRunNights',
            PRF_COMPONENT: {
                TITLE: 'api/PRFComponents/Title',
                NATIONALITY: 'api/PRFComponents/Nationality',
                GUEST_TYPES: 'api/PRFComponents/Nationality',
                GUEST_DETAIL_OPTIONS: 'api/PRFComponents/GuestDetailOptions',
                GUEST_MORE_DETAILS: 'api/PRFComponents/GuestMoreDetailOptions',
                COMPANY_MORE_CUSTOMER_MARKET: 'api/PRFComponents/CustomerMarket',
                COMPANY_MORE_COMMISSION_TYPE: 'api/PRFComponents/CommissionType',
                COMPANY_MORE_LOAI_HINH_HD: 'api/PRFComponents/LoaiHinhHD',
            }
        },
        HCFG: {
            RESERVATION_HCFG: 'api/HCFG/HCFGInfo',
            RSVN_RATECODE: 'api/HCFG/RateCodes',
            RSVN_PAYMENT: 'api/HCFG/PaymentMethods',
            RSVN_TYPE: "api/HCFG/RSVNTypes",
            FIX_CHARGES: "api/HCFG/FixCharges",
            DMUC_MINIBAR: "api/HCFG/GetAllDmucMiniBar",
            DMUC_HANGHOADICHVU: "api/HCFG/GetAllDmucHangHoaDichVu",
            DMUC_QUANAOGIATLA: "api/HCFG/DmucHSKPQuanAoGiatLa",
            DMUC_OUTLET: "api/HCFG/DmucChOutLet",
            DMUC_DEPARTMENT: "api/HCFG/DmucDepartment",
            DMUC_GETMATK1: "api/HCFG/GetMaTKByHotelGuid",
            OPERATOR: {
                KHACH_HANG: 'api/HCFG/Operator/KhachHang',
                HOTEL: 'api/HCFG/Operator/Hotel',
                GET_BUSSINESS_DATE: "api/HCFG/Operator/BusinessDate",
                EXCHANGE_RATE: "api/HCFG/Operator/GetTyGia",
                POST_EXCHANGE_RATE: "api/HCFG/Operator/TyGia",
                INFOR_RUNIGHT: "api/HCFG/Operator/InforRunNightForTsRoom",
                CHECK_INVALID_CARD: "api/HCFG/Operator/CheckCreaditCardNumber",
                GET_LIST_DON_VI_TIEN_TE: "api/HCFG/Operator/DonViTienTe",
                ACTIVEHOTEL: 'api/HCFG/Operator/Hotel'
            }
        },
        CASHIER: {
            GROUP_FOLIO: "api/GroupFolio",
            GET_FOLIO: "api/Folio",
            GET_DATA_FOLIO: "api/Folio/FilterFolio",
            POSTING_MINI_BAR: "api/Folio/PostingMiniBar",
            POSTIN_LAUNDRY: "api/Folio/PostingLaundry",
            NEW_VOUCHER_MINIBAR: "NewestVoucherMiniBar",
            NEW_VOUCHER_LAUNDRY: "NewestVoucherLaundry",
            NEW_VOUCHER_FOOD_OTHERSERVICE: "api/Folio/NewestVoucherFolioId",
            POST_FOODANDBEVERAGE: "api/Folio/PostingFoodAndBeverage",
            POST_OTHERSERVICE: "api/Folio/PostingOrtherService",
            POST_ROOM_CHARGE: "api/Folio/PostingRoomCharge",
            POST_ADVANCE_ROOM_CHARGE: "api/Folio/PostingAdvanceRoomCharge",
            POST_REBATE: "api/Folio/PostingRebate",
            POST_SPLIT: "api/Folio/SplitFolio",
            POST_CORRECTION: "api/Folio/Correction",
            POST_MOVE: "api/Folio/MoveFolio",
            COMBINE_FOLIO: "api/Folio/CombineFolio",
            AMOUNT_ROOMCHAT: "api/Folio/AmountAndRoomChat",
            FILTER_GROUP_FOLIO: "api/Folio/FilterGroupFolio",
            PRINT_FOLIO: "api/print/folio",
            PRINT_RSVN_CONFIRM: "api/print/rsvnConfirm",
            PRINT_FOLIO_HISTORY: "api/print/folioHistory",
            PRINT_REG_CARD: "api/print/regCard",
            RUN_NIGHT: {
                ROOM_CHARGE: "api/RunNight/GetTotalRoomChargeByNight",
                PROCEED_RUN_NIGHT: "api/RunNight/ProceedRunNight",
                GET_BUSSINESS_DATE: "api/RunNight/GetBusinessDate",
                GET_NIGHT_AUDITOR: "api/RunNight/GetNightAuditor",
            },
            CHECK_BALANCE_GUEST_CHECKOUT: "api/GroupFolio/CheckBalanceGuestCheckOut",
            POST_PAYMENT: "api/Folio/PostingPayment",
            TRACE: {
                TRACE_FOLIO: "api/Trace/Folio"
            }
        },
        REPORT: {
            GUEST_BALANCE: "api/report/guestBalance",
            GUEST_INHOUSE: "api/report/inHouse",
            ARRIVAL_DEPARTURE: "api/report/departureArrival",
            COMPANY_AGENT: "api/report/agentCompany",
            ACCOUNT_DETAIL: "api/report/accountDetail",
            GUEST_FOLIO: "api/report/guestFolio",
            END_OF_DAY: "api/report/endOfDay",
            NATIONALITY: "api/report/nationality",
            HOUSEKEEPING: "api/report/houseKeeping"
        },
        HSKP: {
            BLOCK_ROOM: "api/HSKP/HSKBlockRooms"
        },
        OTA_HLS: {
            HLS_HOTEL: "api/HlsHotel",
            RATE_PLAN: "api/HLS/GetRatePlans",
            HOTEL_ROOMTYPE_MAPPING: "api/HotelRoomTypeMapping",
            LAST_ALLOTMENT_QUANTITY: "api/HotelRoomTypeMapping/LastAllotmentQuantity",
            SET_INVENTORY: "api/HLS/SaveInventory",
            CREATE_ALLOTMENT: "api/HotelRoomTypeMapping/CreateDataAllotment",
            GET_ALLOTMENT:"api/HotelRoomTypeMapping/GetDataAllotmentView"
        }
    },
    IMAGE: {
        IMAGE_HOTEL: "dms/Document/file"
    }
}

export default SYSTEM_CONSTANTS