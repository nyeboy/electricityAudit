package com.audit.modules.site.controller;

import com.audit.common.AbstractControllerTest;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author 王松
 * @Description  单元测试类
 * @date 2017/4/21
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class BenchmarkControllerTest extends AbstractControllerTest {

    @Test
    public void powerRating() throws Exception {
        this.mockMvc
                .perform(get("/benchmark/powerRating")
                            .param("pageNo", "1")
                            .param("pageSize", "5"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"))
                .andExpect(jsonPath("pageNo").value(1))
                .andExpect(jsonPath("pageSize").value(5));
    }

    @Test
    public void powerRatingDetail() throws Exception {
        this.mockMvc
                .perform(get("/benchmark/powerRatingDetail")
                        .param("siteId", "c98b93e592574361abc9e6a1138b9115"))
                .andDo(print())
                .andExpect(status().isOk());
    }

}
