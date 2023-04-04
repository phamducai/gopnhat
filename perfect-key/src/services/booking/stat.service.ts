import { BookingStat } from './../../common/model-statistic';
import PkmApi from 'api/pkm/pkm.api';

class BookingStatService {

    static async getBookingStatByRsvnId(rsvnId: string): Promise<BookingStat> {
        const res: BookingStat = await PkmApi.getBookingStat(rsvnId).toPromise();
        return res;
    }
}
export default BookingStatService;
