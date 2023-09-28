package me.krft.frontend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import me.krft.frontend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ApplicationUserOfferTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ApplicationUserOffer.class);
        ApplicationUserOffer applicationUserOffer1 = new ApplicationUserOffer();
        applicationUserOffer1.setId(1L);
        ApplicationUserOffer applicationUserOffer2 = new ApplicationUserOffer();
        applicationUserOffer2.setId(applicationUserOffer1.getId());
        assertThat(applicationUserOffer1).isEqualTo(applicationUserOffer2);
        applicationUserOffer2.setId(2L);
        assertThat(applicationUserOffer1).isNotEqualTo(applicationUserOffer2);
        applicationUserOffer1.setId(null);
        assertThat(applicationUserOffer1).isNotEqualTo(applicationUserOffer2);
    }
}
