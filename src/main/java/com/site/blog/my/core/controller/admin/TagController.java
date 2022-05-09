package com.site.blog.my.core.controller.admin;

import com.site.blog.my.core.entity.BlogLink;
import com.site.blog.my.core.entity.BlogTag;
import com.site.blog.my.core.service.TagService;
import com.site.blog.my.core.util.PageQueryUtil;
import com.site.blog.my.core.util.Result;
import com.site.blog.my.core.util.ResultGenerator;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class TagController {

    @Resource
    private TagService tagService;

    @GetMapping("/tags")
    public String tagPage(HttpServletRequest request) {
        request.setAttribute("path", "tags");
        return "admin/tag";
    }

    @GetMapping("/tags/list")
    @ResponseBody
    public Result list(@RequestParam Map<String, Object> params) {
        if (StringUtils.isEmpty(params.get("page")) || StringUtils.isEmpty(params.get("limit"))) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        PageQueryUtil pageUtil = new PageQueryUtil(params);
        return ResultGenerator.genSuccessResult(tagService.getBlogTagPage(pageUtil));
    }

    /**
     * 标签添加
     */
    @RequestMapping(value="/tags/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(@RequestParam("tagName") String tagName) {
        if (StringUtils.isEmpty(tagName)) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        if (tagService.saveTag(tagName)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult("标签名称重复");
        }
    }

    /**
     * 详情
     */
    @GetMapping("/tags/info/{id}")
    @ResponseBody
    public Result info(@PathVariable("id") Integer id) {
        BlogTag tag = tagService.selectById(id);
        return ResultGenerator.genSuccessResult(tag);
    }

    /**
     * 标签修改
     */
    @RequestMapping(value = "/tags/update", method = RequestMethod.POST)
    @ResponseBody
    public Result update(@RequestParam("tagId") Integer tagId,
                         @RequestParam("tagName") String tagName,
                         @RequestParam("isDeleted") Byte isDeleted) {
        BlogTag tempTag = tagService.selectById(tagId);
        if (tempTag == null) {
            return ResultGenerator.genFailResult("无数据！");
        }
        if (StringUtils.isEmpty(tagName)|| isDeleted!=0) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        tempTag.setTagName(tagName);
        return ResultGenerator.genSuccessResult(tagService.updateTag(tempTag));
    }

    /**
     * 标签删除
     */
    @PostMapping("/tags/delete")
    @ResponseBody
    public Result delete(@RequestBody Integer[] ids) {
        if (ids.length < 1) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        if (tagService.deleteBatch(ids)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult("有关联数据请勿强行删除");
        }
    }


}
