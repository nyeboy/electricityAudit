package com.audit.modules.common.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Created on 15-6-26.
 * 封装了stream的一些常见用法。具体使用方式请参考同名测试文件
 * @author 王松
 */
public class StreamUtil {

    /**
     * 去掉重复的列表。判断是否重复是根据equals方法
     * @param list 有可能拥有重复数据的列表
     * @param <T>
     * @return
     */
    public static <T> List<T> distinct(List<T> list){
        List<T> result = new ArrayList<>();
        if(list == null){
            return result;
        }
        list.stream().filter(t -> !result.contains(t)).forEach(result::add);
        return result;
    }

    /**
     * 根据指定属性去掉重复的列表
     * @param list 有可能拥有重复数据的列表
     * @param function 指定对象的属性
     * @param <T>
     * @param <V>
     * @return
     */
    public static <T, V> List<T> distinct(List<T> list, Function<T, V> function){
        List<T> result = new ArrayList<>();
        //用于识别是否重复的列表
        List<V> distinctList = new ArrayList<>();
        if(list == null){
            return result;
        }
        list.stream().filter(
                t -> {
                    V v = function.apply(t);
                    if(!distinctList.contains(v)){
                        distinctList.add(v);
                        return true;
                    }
                    return false;
                }
        ).forEach(result::add);
        return result;
    }

    /**
     * 将目标列表中的某个字符串属性拼接成一个完成的字符串
     * @param list 目标列表
     * @param function 属性选取规则
     * @param delimiter 拼接规则
     * @param <T> 列表类型
     * @return
     */
    public static <T> String joining(Collection<T> list, Function<T, String> function, CharSequence delimiter){
        if(list == null || list.isEmpty()){
            return "";
        }
        return list.stream().map(function).collect(Collectors.joining(delimiter));
    }
    public static String joining(Collection<String> list, CharSequence delimiter){
        if(list == null || list.isEmpty()){
            return "";
        }
        return list.stream().collect(Collectors.joining(delimiter));
    }

    /**
     * 获取列表中的指定属性
     * @param beans 指定的列表
     * @param function 指定的属性获取规则
     * @param <T> 列表泛型
     * @param <R> 属性泛型
     * @return List
     */
    public static <T, R> List<R> getProps(Collection<T> beans, Function<T, R> function){
        if(beans == null || beans.isEmpty()){
            return new ArrayList<>();
        }
        return beans.stream().map(function).collect(Collectors.toList());
    }

    /**
     * 将指定的列表将指定的属性做为key，转换成Map
     * @param beans 需要转换的列表
     * @param function 获取Key的规则
     * @param <T> 列表泛型
     * @param <R> 属性泛型
     * @return Map
     */
    public static <T, R> Map<R, T> convertListToMap(Collection<T> beans, Function<T, R> function){
        if(beans == null || beans.isEmpty()){
            return new HashMap<>();
        }
        return beans.stream().collect(Collectors.toMap(function, t -> t));
    }

    /**
     * 将指定的列表根据key进行统计
     * @param beans 需要转换的目标列表
     * @param function key的生成规则
     * @param <T> value泛型
     * @param <R> key泛型
     * @return Map
     */
    public static <T, R> Map<R, Long> convertListToMapCount(List<T> beans, Function<T, R> function){
        if(beans == null || beans.isEmpty()){
            return new HashMap<>();
        }
        return beans.stream().collect(Collectors.groupingBy(function, Collectors.counting()));
    }

    /**
     * 将指定的列表转换成以指定规则生成的数据为key，List为value的Map
     * @param beans 需要转换的目标列表
     * @param function key的生成规则
     * @param <T> value泛型
     * @param <R> key泛型
     * @return Map
     */
    public static <T, R> Map<R, List<T>> convertListToMapList(Collection<T> beans, Function<T, R> function){
        if(beans == null || beans.isEmpty()){
            return new HashMap<>();
        }
        return beans.stream().collect(Collectors.groupingBy(function, Collectors.toList()));
    }

    /**
     * 更加正确的做法是新建一个RandomUtil静态工具类，然后将该方法移动过去
     * 打乱列表的顺序
     * @param beans 需要被打乱的列表
     * @param <T> 泛型
     */
    public static <T> void randomList(List<T> beans){
        if(beans == null || beans.isEmpty()){
            return;
        }

        List<T> tmp = beans.stream().sorted(
                (b1, b2) -> {
                    if (b1 == b2) {
                        return 0;
                    } else {
                        return new Random().nextInt(2) == 1 ? 1 : -1;
                    }
                }
        ).collect(Collectors.toList());

        beans.clear();
        beans.addAll(tmp);
    }

    /**
     * 按照默认排序方式（asc）排序
     * @param beans 需要排序的列表
     * @param function 排序属性指定规则
     * @param <T> 排序对象类型
     * @param <R> 排序属性类型
     */
    public static <T, R extends Comparable<? super R>> void sort(List<T> beans, Function<T, R> function){
        sortAsc(beans, function);
    }

    /**
     * 根据给定属性升序排序
     * @param beans 需要排序的列表
     * @param function 排序属性指定规则
     * @param <T> 排序对象类型
     * @param <R> 排序属性类型
     */
    public static <T, R extends Comparable<? super R>> void sortAsc(List<T> beans, Function<T, R> function){
        sort(beans, function, Sorter.ASC);
    }

    /**
     * 根据给定属性降序排序
     * @param beans 需要排序的列表
     * @param function 排序属性指定规则
     * @param <T> 排序对象类型
     * @param <R> 排序属性类型
     */
    public static <T, R extends Comparable<? super R>> void sortDesc(List<T> beans, Function<T, R> function){
        sort(beans, function, Sorter.DESC);
    }

    /**
     * 排序方法
     * @param beans 被排序的列表
     * @param function 排序属性生成规则
     * @param sortType 排序方式。asc升序；desc降序
     * @param <T> 排序对象的泛型
     * @param <R> 排序属性的泛型
     */
    public static <T, R extends Comparable<? super R>> void sort(List<T> beans, Function<T, R> function, String sortType){
        sort(beans, new Sorter(function, sortType));
    }

    public static <T, R extends Comparable<? super R>> void sort(List<T> beans, Sorter... sorters){
        //对异常参数做处理
        if(beans == null || beans.size() == 0){
            return;
        }
        if(sorters == null || sorters.length == 0){
            return;
        }

        List<T> tem = beans.stream().sorted(
                (b1, b2) -> compare(b1, b2, sorters)
        ).collect(Collectors.toList());

        //如果排序出现异常，放弃排序
        if(tem == null || tem.size() == 0){
            return;
        }

        //将排序结果保存在原来的列表中
        beans.clear();
        beans.addAll(tem);
    }
    public static <T, R extends Comparable<? super R>> int compare(T b1, T b2, Sorter... sorters) {
        double result = 0d;
        for (int i = 0; i < sorters.length; i++) {
            Sorter sorter = sorters[i];
            double multiples = Math.pow(10, (sorters.length - i));
            result += multiples * compare(b1, b2, sorter.function, sorter.sortType);
//            System.out.println(sorter.function.apply(b1) + " compare " + sorter.function.apply(b2) + " result = " + result);
        }

        if(result > 0){
            return 1;
        } else if (result < 0) {
            return -1;
        }
        return 0;
    }
    private static <T, R extends Comparable<? super R>> int compare(T b1, T b2, Function<T, R> function, String sortType){
        R r1 = function.apply(b1);
        R r2 = function.apply(b2);
        int result = 0;
        //升序
        if(sortType == null || sortType.equalsIgnoreCase(Sorter.ASC)){
            if(r1 == null){
                return -1;
            } else if (r2 == null){
                return 1;
            }
            result = r1.compareTo(r2);
        } else {
            if(r1 == null){
                return 1;
            } else if (r2 == null){
                return -1;
            }
            result = r2.compareTo(r1);
        }

        if(result > 0){
            result = 1;
        } else if (result < 0) {
            result = -1;
        }
        return result;
    }

    public static class Sorter<T, R> {
        protected Function<T, R> function;
        protected String sortType;
        public static final String ASC = "asc";
        public static final String DESC = "desc";

        public Sorter(Function<T, R> function, String sortType){
            this.function = function;
            this.sortType = sortType;
        }
    }

    public static class SorterASC<T, R> extends Sorter<T, R> {
        public SorterASC(Function<T, R> function){
            super(function, ASC);
        }
    }

    public static class SorterDESC<T, R> extends Sorter<T, R> {
        public SorterDESC(Function<T, R> function){
            super(function, DESC);
        }
    }
}
