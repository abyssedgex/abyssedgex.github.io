---
title: "hadoop实战(二)"
date: 2017-06-01T17:30:01+08:00
tags: ["大数据", "hadoop"]
categories: ["开发者手册"]
draft: false
---
# WordCount统计词频

## MapReduce实现

### WordCount.java源码

```
import java.io.IOException;
import java.util.StringTokenizer;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
public class WordCount {
  public static class TokenizerMapper extends Mapper<Object, Text, Text, IntWritable>{
    private final static IntWritable one = new IntWritable(1);
    private Text word = new Text();
    public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
      StringTokenizer itr = new StringTokenizer(value.toString());
      while (itr.hasMoreTokens()) {
        word.set(itr.nextToken());
        context.write(word, one);
      }
    }
  }
  public static class IntSumReducer extends Reducer<Text,IntWritable,Text,IntWritable> {
    private IntWritable result = new IntWritable();
    public void reduce(Text key, Iterable<IntWritable> values,
                        Context context) throws IOException, InterruptedException {
        int sum = 0;
        for (IntWritable val : values) {
          sum += val.get();
        }
        result.set(sum);
        context.write(key, result);
    }
  }
  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "word count");
    job.setJarByClass(WordCount.class);
    job.setMapperClass(TokenizerMapper.class);
    job.setCombinerClass(IntSumReducer.class);
    job.setReducerClass(IntSumReducer.class);
    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(IntWritable.class);
    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
}
```

### 编译

```
hadoop com.sun.tools.javac.Main WordCount.java
jar cf wc.jar WordCount*.class
```

### 创建DFS

在hdfs上的用户目录下创建输入/输出文件的文件夹.

```
hadoop fs -mkdir -p /user/{whoami}/wordcount/input
```

下本书

```
mkdir -p ~/tmp/book/
cd ~/tmp/book
wget http://www.gutenberg.org/files/5000/5000-8.txt
```

将书放到HDFS上

```
hadoop fs -put ~/tmp/book/*.txt /user/${whoami}/wordcount/input
```

### 执行MapReduce

```
hadoop jar wc.jar WordCount /user/${whoami}/wordcount/input /user/${whoami}/wordcount/output
```

查看解析内容

```
hadoop fs -cat /user/${whoami}/wordcount/output/part-r-00000
```

## HadoopStreaming实现

Hadoop是使用Java语言编写的,所以最直接的方式的就是使用Java语言来实现Mapper和Reducer,然后配置MapReduce Job,提交到集群计算环境来完成计算.
hadoop也为其它语言，如C++、Shell、Python、 Ruby、PHP、Perl等提供了支持，这个工具就是Hadoop Streaming.

### wordcount的python实现

mapper.py源码

```
#!/usr/bin/env python
import sys
def read_input(file):
    for line in file:
        yield line.split()
def main(separator='\t'):
    data = read_input(sys.stdin)
    for words in data:
        for word in words:
            print "%s%s%d" % (word, separator, 1)
if __name__ == "__main__":
    main()
```

reducer.py

```
#!/usr/bin/env python
from operator import itemgetter
from itertools import groupby
import sys
def read_mapper_output(file, separator = '\t'):
    for line in file:
        yield line.rstrip().split(separator, 1)
def main(separator = '\t'):
    data = read_mapper_output(sys.stdin, separator = separator)
    for current_word, group in groupby(data, itemgetter(0)):
        try:
            total_count = sum(int(count) for current_word, count in group)
            print "%s%s%d" % (current_word, separator, total_count)
        except valueError:
            pass
if __name__ == "__main__":
    main()
```

### 运行

可以写个sh脚本运行

```
hadoop jar $STREAM  \
-files ./mapper.py,./reducer.py \
-mapper ./mapper.py \
-reducer ./reducer.py \
-input /user/${whoami}/wordcount/input/ \
-output ~/output
```

## Spark实现

运行spark的python交互式控制台,pyspark.

```
hadoop@4532e4bdaa51:~$ pyspark
Python 2.7.6 (default, Jun 22 2015, 17:58:13)
[GCC 4.8.2] on linux2
Type "help", "copyright", "credits" or "license" for more information.
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel).
16/10/28 02:10:51 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /__ / .__/\_,_/_/ /_/\_\   version 2.0.1
      /_/
Using Python version 2.7.6 (default, Jun 22 2015 17:58:13)
SparkSession available as 'spark'.
>>>
```

使用textFile加载文本到RDD,进行’wordcount’.

```
>>> text = sc.textFile("hdfs://localhost:9000/user/${whoami}/wordcount/input")
>>> counts = text.flatMap(lambda line: line.split(" ")).map(lambda word: (word,1)).reduceByKey(lambda x,y: x + y)
```

调用saveAsTextFile,分布式作业开始…

```
counts.saveAsTextFile("hdfs://localhost:9000/wordcount/spark_out")
```

可以在工作台输出目录里查看

```
hadoop fs -cat  hdfs://localhost:9000/wordcount/spark_out/part-00000
...
(u'Well', 1)
(u'roar,', 1)
(u'Lust', 1)
(u'up-side-down', 1)
(u'sozza', 1)
(u'primus', 1)
(u'expands', 1)
...
```
