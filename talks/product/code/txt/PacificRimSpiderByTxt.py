# _*_ coding: utf-8 _*_
__author__ = 'lizorn'
__date__ = '2018/4/5 19:56'

from urllib import request
from urllib.error import URLError, HTTPError
from bs4 import BeautifulSoup as bs
import re
import jieba  # 分词包
import pandas as pd
import numpy    #numpy计算包
import matplotlib.pyplot as plt
import matplotlib
from wordcloud import WordCloud   #词云包

# 分词
with open('PacificRim.txt') as f:
    cleaned_comments = f.read()
    segment = jieba.lcut(cleaned_comments)
    words_df = pd.DataFrame({'segment': segment})

    # 去除常用高频词
    stopwords = pd.read_csv("chineseStopWords.txt", index_col=False, quoting=3, sep="\t", names=['stopword'], encoding='utf-8')#quoting=3全不引用
    words_df = words_df[~words_df.segment.isin(stopwords.stopword)]

    # 词频统计
    words_stat = words_df.groupby(by=['segment'])['segment'].agg({"计数":numpy.size})
    words_stat = words_stat.reset_index().sort_values(by=["计数"], ascending=False)

    print(words_stat.head())

    # 词云
    matplotlib.rcParams['figure.figsize'] = (10.0, 5.0)

    wordcloud = WordCloud(font_path="simhei.ttf", background_color="white", max_font_size=80)  # 指定字体类型、字体大小和字体颜色
    word_frequence = {x[0]: x[1] for x in words_stat.head(1000).values}
    # word_frequence_list = []
    # for key in word_frequence:
    #     temp = (key, word_frequence[key])
    #     word_frequence_list.append(temp)
    # print(word_frequence_list)
    wordcloud = wordcloud.fit_words(word_frequence)
    plt.imshow(wordcloud)
    plt.show()