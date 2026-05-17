package com.curtain_call.server_core;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled("CI 환경에서는 DB 연결이 없으므로 비활성화")
@SpringBootTest
class ServerCoreApplicationTests {

	@Test
	void contextLoads() {
	}

}
