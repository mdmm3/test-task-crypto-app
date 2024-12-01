import { Container, Title} from "@mantine/core";

import Layout from "@/shared/components/Layout";
import List from "@/features/rates/RatesList";

function RatesPage() {
  return (
    <Layout>
      <Container size="xs">
        <Title order={1}>Rates</Title>
        <List />
      </Container>
    </Layout>
  );
}


export default RatesPage;