import {
  findDistrictWithSortedSchedule,
  mapLocations,
} from '../../../utils/collection-district';
import { ClientDistrictPage } from './district';

export default async function DistrictPage({
  params,
}: {
  params: { district: string };
}) {
  // export const getServerSideProps: GetServerSideProps = async (context) => {
  const districtName = decodeURIComponent(params.district);
  const district = await findDistrictWithSortedSchedule(districtName);

  if (!district) {
    throw new Error(`could not find district ${districtName}`);
  }

  return (
    <ClientDistrictPage
      district={JSON.parse(JSON.stringify(district))}
      locations={JSON.parse(JSON.stringify(mapLocations(district)))}
    />
  );
}
