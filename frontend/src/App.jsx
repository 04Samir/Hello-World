/*
    The Root Component
    ------------------
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context';
import { AuthenticatedRoute } from './components';

import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { SignUp } from './pages/SignUp';
import { LogIn } from './pages/LogIn';
import { LogOut } from './pages/LogOut';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Courses } from './pages/Courses';
import { Course } from './pages/Course';
import { CourseTopics } from './pages/CourseTopics';
import { CourseCategory } from './pages/CourseCategory';
import { CourseTopic } from './pages/CourseTopic';
import { CourseTopicQuiz } from './pages/CourseTopicQuiz';
import { CourseTopicQuizResults } from './pages/CourseTopicQuizResults';
import { NotFound } from './pages/404-Not-Found';


export const App = () => {
    return (
        <Router basename={process.env.PUBLIC_URL || '/'}>
            <AuthProvider>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path='search' element={<Search />} />
                    <Route path='sign-up' element={<SignUp />} />
                    <Route path='log-in' element={<LogIn />} />
                    <Route path='log-out' element={<LogOut />} />
                    <Route
                        path='dashboard'
                        element={
                            <AuthenticatedRoute>
                                <Dashboard />
                            </AuthenticatedRoute>
                        }
                    />
                    <Route
                        path='settings'
                        element={
                            <AuthenticatedRoute>
                                <Settings />
                            </AuthenticatedRoute>
                        }
                    />
                    <Route path='users/:username' element={<Profile />} />
                    <Route path='courses' element={<Courses />} />
                    <Route path='courses/:course' element={<Course />} />
                    <Route path='courses/:course/topics' element={<CourseTopics />} />
                    <Route path='courses/:course/topics/:category' element={<CourseCategory />} />
                    <Route path='courses/:course/topics/:category/:topic' element={<CourseTopic />} />
                    <Route
                        path='courses/:course/topics/:category/quiz'
                        element={
                            <AuthenticatedRoute>
                                <CourseTopicQuiz />
                            </AuthenticatedRoute>
                        }
                    />
                    <Route
                        path='courses/:course/topics/:category/quiz/results'
                        element={
                            <AuthenticatedRoute>
                                <CourseTopicQuizResults />
                            </AuthenticatedRoute>
                        }
                    />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};
