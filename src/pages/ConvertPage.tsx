import { Container, Title } from "@mantine/core";

import Convert from "@/features/convert/Convert";
import Layout from "@/shared/components/Layout";

function ConvertPage() {
  return (
    <Layout>
      <Container size="sm">
        <Title order={1}>Convert</Title>
        <Convert />
      </Container>
    </Layout>
  );
}

export default ConvertPage;