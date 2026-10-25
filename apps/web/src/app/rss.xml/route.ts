import { GET as getFeedXml } from '../feed.xml/route';

export async function GET() {
    return getFeedXml();
}
