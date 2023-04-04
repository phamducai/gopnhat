export interface ISubMenu{
    type: TypeSubMenu,
    name: string,
    hr: boolean,
}
export type TypeSubMenu = 'rate' | 'groupCode' |
'arrivalDate' | 'departureDate' | 'edit-arr-de-date' |
'comments' | 'roomType' | 'confirmed' | 'cutOfDate' | 'agentGuid' | 'companyGuid';

export const arrSubMenu: ISubMenu[] = [
    {
        type: 'rate',
        name: 'Edit Rate',
        hr: false
    },
    {
        type: 'groupCode',
        name: 'Edit Group Code',
        hr: true
    },
    {
        type: 'arrivalDate',
        name: "Edit Arrival's Date",
        hr: false
    },
    {
        type: 'departureDate',
        name: "Edit Departure's Date",
        hr: false
    },
    {
        type: 'edit-arr-de-date',
        name: "Edit Arrival & Departure Date",
        hr: true
    },
    {
        type: 'comments',
        name: "Edit Comment's Group",
        hr: false
    },
    {
        type: 'roomType',
        name: "Edit Room Type's Group",
        hr: true
    },
    {
        type: 'confirmed',
        name: 'Confirmed', 
        hr: false
    },
    {
        type: 'cutOfDate',
        name: 'Edit Cut Of Date',
        hr: true
    },
    {
        type: 'agentGuid',
        name: "Edit Agent's Group",
        hr: false
    },
    {
        type: 'companyGuid',
        name: "Edit Company's Group",
        hr: false
    }
]