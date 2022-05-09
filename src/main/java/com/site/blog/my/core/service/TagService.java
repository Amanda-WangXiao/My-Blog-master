package com.site.blog.my.core.service;

import com.site.blog.my.core.entity.BlogLink;
import com.site.blog.my.core.entity.BlogTag;
import com.site.blog.my.core.entity.BlogTagCount;
import com.site.blog.my.core.util.PageQueryUtil;
import com.site.blog.my.core.util.PageResult;

import java.util.List;

public interface TagService {

    /**
     * 查询标签的分页数据
     *
     * @param pageUtil
     * @return
     */
    PageResult getBlogTagPage(PageQueryUtil pageUtil);

    int getTotalTags();

    Boolean saveTag(String tagName);

    BlogTag selectById(Integer id);//新增

    Boolean updateTag(BlogTag tempTag);//新增

    Boolean deleteBatch(Integer[] ids);

    List<BlogTagCount> getBlogTagCountForIndex();
}
